const url = process.env.SERVER_URL || 'http://localhost:3000';

async function handleGetPost(postID){
    try {
        const response = await fetch(`${url}/posts?id=${postID}`, {
            method: 'GET'
        });

        let json = await response.json();
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