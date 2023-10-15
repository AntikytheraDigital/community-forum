const url = process.env.SERVER_URL || 'http://localhost:3000';

async function handleGetPost(postID){
    try {
        // TODO: Update fetch to use the correct endpoint
        const response = await fetch(`${url}/posts?id=${postID}`, {
            method: 'GET'
        });

        let json = await response.json();
        let post = json["post"];
        let date = new Date(post["timestamp"]);
        post["timestamp"] = date.toLocaleString();

        // TODO: Temporarily add comments to post
        post["comments"] = [
            {
                _id: "251a39cb4682dc4660ac2519",
                authorID: "FunnyGuy4",
                timestamp: "2023-10-04T01:15:12.630+00:00",
                content: "This is a comment."
            },
            {
                _id: "551a39cb4682dc4660ac2519",
                authorID: "NotFunnyGuy",
                timestamp: "2023-10-04T02:15:12.630+00:00",
                content: "This is another less funny comment."
            }
        ]

        return post;
    } catch {
        console.log("Error getting post.");
        return {error: "Error getting post."}
    }
}

module.exports = {
    handleGetPost: handleGetPost
}