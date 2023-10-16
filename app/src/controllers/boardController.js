const serverRequest = require('../middleware/serverRequest');

async function handleGetAllPosts() {
    let posts = []

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    let json = await serverRequest.makeRequest('/posts/all', requestOptions);

    if (json.error) {
        return {"error": json.error}
    }

    posts = json["posts"];

    // Change timestamp to readable format
    for (const post of posts) {
        let date = new Date(post["timestamp"]);
        post["timestamp"] = date.toLocaleString();
    }

    return posts;
}

async function handleGetBoardPosts(boardName) {
    let posts = [];

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    let json = await serverRequest.makeRequest(`/posts/findByBoard?boardName=${boardName}`, requestOptions);

    if (json.error) {
        return {"error": json.error}
    }

    posts = json["posts"];

    // Change timestamp to readable format
    for (const post of posts) {
        let date = new Date(post["timestamp"]);
        post["timestamp"] = date.toLocaleString();
    }

    return posts;
}


module.exports = {
    handleGetAllPosts: handleGetAllPosts,
    handleGetBoardPosts: handleGetBoardPosts
};