const serverRequest = require('../middleware/serverRequest');
require('dotenv').config();
const maxAge = process.env.MAX_AGE || 10 * 60 * 1000;

// Add username to the options object
function addUsername(req, res, options) {
    options.loggedIn = false;

    if (!req.cookies.JWT || !req.cookies.username) {
        res.clearCookie('JWT');
        res.clearCookie('username');
        return;
    }

    options.loggedIn = true;
    options.username = req.cookies.username;
    options.jwt = req.cookies.JWT;
}

async function handleSubmit(req) {
    let {username, email, password} = req;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, password})
    };

    try {
        const response = await serverRequest.makeRequest('/auth/register', requestOptions);

        if (response.status === 201) {
            return [201, `${username} registered to database.`];
        }

        return [response.status, response['error']];
    } catch {
        return [500, "Server error."];
    }
}

async function handleLogin(req, res) {
    let {username, password} = req;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    };

    try {
        const response = await serverRequest.makeRequest('/auth/login', requestOptions);

        if (response.status === 200) {
            // Add JWT token to cookie
            res.cookie('JWT', response['JWT'], {httpOnly: true, secure: true});
            res.cookie('username', username, {httpOnly: true, secure: true});
            res.cookie('refreshToken', response['refreshToken'], {httpOnly: true, secure: true});
            res.cookie('jwtExpiry', new Date().getTime() + maxAge, {httpOnly: true, secure: true});

            return [200, `${username} logged in.`];
        }

        return [response.status, "Invalid username or password."];
    } catch {
        return [500, "Server error."];
    }
}

async function getOAuthURL() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = await serverRequest.makeRequest('/auth/google/url', requestOptions);
    // check response status
    if (response.status === 200) {
        return {url: response.url};
    } else {
        return {error: "Error retrieving OAuth URL"};
    }
}

async function handleOAuthLogin(req, res) {
    const code = req.query.code;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await serverRequest.makeRequest(`/auth/oauth/login?code=${code}`, requestOptions);

    if (response.status === 200 || response.status === 201) {
        // expires after 10 minutes
        res.cookie('JWT', response['JWT'], {httpOnly: true, secure: true});
        res.cookie('username', response['username'], {httpOnly: true, secure: true});
        res.cookie('refreshToken', response['refreshToken'], {httpOnly: true, secure: true});
        res.cookie('jwtExpiry', new Date().getTime() + maxAge, {httpOnly: true, secure: true});

        console.log("Logged in with OAuth.")
        return {status: 200, message: "Logged in with OAuth."};
    }

    return {error: "Error logging in with OAuth.", status: response.status};
}

async function logoutUser(req, res) {
    // Get refresh token from cookies
    let refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'refreshToken': refreshToken
            }
        }

        await serverRequest.makeRequest('/auth/logout', requestOptions);
    }

    res.clearCookie('JWT');
    res.clearCookie('username');
    res.clearCookie('refreshToken');
    res.clearCookie('jwtExpiry');
}

async function getNewAccessToken(req, res) {
    let refreshToken = req.cookies.refreshToken;
    if (!req.cookies.JWT || !refreshToken || !req.cookies.username || !req.cookies.jwtExpiry) {
        return;
    }

    let currentTime = new Date().getTime();
    let jwtTime = req.cookies.jwtExpiry;

    // if more than 20 minutes have passed since the JWT was issued, logout
    if (currentTime - jwtTime > maxAge) {
        await logoutUser(req, res);
    }

    // if less than 10 minutes have passed since the JWT was issued, return
    if (currentTime - jwtTime < 0) {
        return;
    }

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'refreshToken': refreshToken
        }
    }

    const response = await serverRequest.makeRequest('/auth/refresh', requestOptions);

    if (response.status === 200) {
        res.cookie('JWT', response['JWT'], {httpOnly: true, secure: true});
        res.cookie('jwtExpiry', new Date().getTime() + maxAge, {httpOnly: true, secure: true});
        return;
    }

    await logoutUser(req, res);
}

module.exports = {
    handleSubmit: handleSubmit,
    handleLogin: handleLogin,
    getOAuthURL: getOAuthURL,
    handleOAuthLogin: handleOAuthLogin,
    addUsername: addUsername,
    logoutUser: logoutUser,
    getNewAccessToken: getNewAccessToken
};