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

module.exports = {
    handleSubmit: handleSubmit
};