const serverRequest = require('../middleware/serverRequest');

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

module.exports = {
    handleSubmit: handleSubmit,
    handleLogin: handleLogin,
    checkLoggedIn: checkLoggedIn,
    getOAuthURL: getOAuthURL
};