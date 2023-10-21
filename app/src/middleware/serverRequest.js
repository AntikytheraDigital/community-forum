const {GoogleAuth} = require('google-auth-library');
const auth = new GoogleAuth();
const authentication = require('./authentication');

const url = process.env.SERVER_URL || 'http://localhost:3000/';
let client;

async function attachAuthHeader(requestOptions) {
    if (!client) client = await auth.getIdTokenClient(url);
    const clientHeaders = await client.getRequestHeaders();
    requestOptions.headers['Authorization'] = clientHeaders['Authorization'];
}

async function makeRequest(route, requestOptions) {
    if (process.env.USE_AUTH === 'true') {
        try {
            await attachAuthHeader(requestOptions);
        } catch (err) {
            console.log('could not create an identity token: ' + err.message);
            return {"error": "Auth error making request.", "status": 401}
        }
    }

    let response;
    try {
        response = await fetch(new URL(route, url), requestOptions);
    } catch (err) {
        console.log("Error making request: ", err);
        return {"error": "Server error making request.", "status": 500};
    }


    if (!response.headers.get('Content-Type').includes('application/json')) {
        console.error("Expected JSON response but received:", response.headers.get('Content-Type'));
        return {"error": "Unexpected response format.", "status": response.status};
    }
    let json = await response.json();
    
    if (response.ok) {
        json["status"] = response.status;
        return json;
    }

    return {"error": json.error || "Error making request.", "status": response.status};
}

module.exports = {
    makeRequest: makeRequest
}
