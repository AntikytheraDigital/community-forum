const authController = require("../controllers/authController");

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

module.exports = {
    checkLoggedIn: checkLoggedIn
}