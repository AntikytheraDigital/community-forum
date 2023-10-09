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

async function handleGetBoards(){
    let boards = [];
    try{
        const response = await fetch(`${url}/boards`, {
            method: 'GET'
        });

        let json = await response.json();
        boards = json["boards"];

    } catch(error){
        console.log("Error getting boards: ", error);
        return {"error": "Error getting boards."}
    }
    
    return boards;
}


module.exports = {
    handleGetAllPosts: handleGetAllPosts, 
    handleGetBoardPosts: handleGetBoardPosts, 
    handleGetBoards: handleGetBoards
};