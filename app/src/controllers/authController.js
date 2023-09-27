const url = process.env.SERVER_URL || 'http://localhost:3000';

async function handleSubmit(req) {
    let {username, email, password} = req;

    try {
        const response = await fetch(`${url}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({username, email, password})
        });

        if (response.status === 201) {
            return [201, JSON.stringify({message: `${username} registered to database.`})];
        }

        let json = await response.json();
        return [response.status, json['error']];
    } catch {
        return [500, "Server error."];
    }
}

module.exports = {
    handleSubmit: handleSubmit
};