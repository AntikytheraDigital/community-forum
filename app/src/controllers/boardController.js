const url = process.env.SERVER_URL || 'http://localhost:3000';

async function handleGetAllPosts() {
    // TODO: Get all board ids
    let boardIDs = ["testBoard", "testBoard2", "testBoard23", "FunnyStuff"];
    let postIDs = [];

    for (const boardID of boardIDs) {
        try {
            const response = await fetch(`${url}/board/getPosts/${boardID}`, {
                method: 'GET'
            });

            let json = await response.json();
            let jsonIDs = json["postIDs"];
            postIDs = postIDs.concat(jsonIDs);
        } catch {
            console.log("Error getting posts from board: " + boardID);
        }
    }

    let posts = [];
    for (const postID of postIDs) {
        try {
            const response = await fetch(`${url}/post/getPost/${postID}`, {
                method: 'GET'
            });

            posts.push((await response.json())["post"]);
        } catch {
            console.log("Error getting post: " + postID);
        }
    }

    // Sort by date
    posts = posts.sort((a, b) => {
        return new Date(b["timestamp"]) - new Date(a["timestamp"]);
    });

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