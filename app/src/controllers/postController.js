const serverRequest = require('../middleware/serverRequest');

async function handleGetPost(postID){
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        let json = await serverRequest.makeRequest(`/posts?id=${postID}`, requestOptions);

        if (json.error) {
            return {"error": json.error}
        }

        let post = json["post"];
        let date = new Date(post["timestamp"]);
        post["timestamp"] = date.toLocaleString();

        return post;
    } catch {
        console.log("Error getting post.");
        return {error: "Error getting post."}
    }
}

module.exports = {
    handleGetPost: handleGetPost
}