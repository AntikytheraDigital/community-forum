const url = process.env.SERVER_URL || 'http://localhost:3000';

async function handleGetAllPosts() {
    let posts = []
    try {
        const response = await fetch(`${url}/board/getallposts/`, {
            method: 'GET'
        });

        let json = await response.json();
        posts = json["posts"];
    } catch {
        console.log("Error getting all posts.");
        return {"error": "Error getting all posts."}
    }

    // Change timestamp to readable format
    for (const post of posts) {
        let date = new Date(post["timestamp"]);
        post["timestamp"] = date.toLocaleString();
    }

    return posts;
}

module.exports = {
    handleGetAllPosts: handleGetAllPosts
};