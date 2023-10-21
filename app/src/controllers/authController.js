const serverRequest = require('../middleware/serverRequest');

function getUsername(req, res) {
    if (!req.cookies.JWT || !req.cookies.username) {
        res.clearCookie('JWT');
        res.clearCookie('username');
        return null;
    }

    return req.cookies.username;
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

            return [200, `${username} logged in.`];
        }

        return [response.status, "Invalid username or password."];
    } catch {
        return [500, "Server error."];
    }
}

async function checkLoggedIn(token, res) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'JWT': token
        }
    };

    try {
        const response = await serverRequest.makeRequest('/auth/check', requestOptions);

        if (response.status === 200) {
            return [200, response['username']];
        }

        // remove JWT cookie if invalid
        res.clearCookie('JWT');

        return [response.status, "User not logged in."];
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
        res.cookie('JWT', response['JWT'], {httpOnly: true, secure: true});
        res.cookie('username', response['username'], {httpOnly: true, secure: true})

        console.log("Logged in with OAuth.")
        return {status: 200, message: "Logged in with OAuth."};
    }

    return {error: "Error logging in with OAuth.", status: response.status};
}

module.exports = {
    handleSubmit: handleSubmit,
    handleLogin: handleLogin,
    checkLoggedIn: checkLoggedIn,
    getOAuthURL: getOAuthURL,
    handleOAuthLogin: handleOAuthLogin,
    getUsername: getUsername
};