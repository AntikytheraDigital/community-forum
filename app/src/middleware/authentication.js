const authController = require("../controllers/authController");
const maxAge = process.env.MAX_AGE || 15000;

async function checkLoggedIn(req, res, options) {
    options.loggedIn = false;

    if (!req.cookies.JWT) {
        return;
    }
    let loggedIn = await authController.checkLoggedIn(req.cookies.JWT, res);

    if (loggedIn[0] === 200) {
        options.loggedIn = true;
        options.username = loggedIn[1];
    }
}

async function checkMaxAge(req, res) {
    if (!req.cookies.JWT) {
        return;
    }

    let currentTime = new Date().getTime();
    let jwtTime = new Date(req.cookies.JWT.exp * 1000).getTime();

    // if more than 20 minutes have passed since the JWT was issued, logout
    if (currentTime - jwtTime > maxAge * 2) {
        await authController.logoutUser(req, res);
        return;
    }

    // if more than 10 minutes have passed since the JWT was issued, refresh the JWT
    if (currentTime - jwtTime > maxAge) {
        await authController.getNewAccessToken(req, res);
    }
}

module.exports = {
    checkMaxAge: checkMaxAge
}