const serverRequest = require('../middleware/serverRequest');

async function handleGetPost(postID){
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        let json = await serverRequest.makeRequest(`/posts/${postID}`, requestOptions);

        if (json.error) {
            return {"error": json.error, "status": json.status};
        }

        let post = json["post"];
        let date = new Date(post["timestamp"]);
        post["timestamp"] = date.toLocaleString();

        return post;
    } catch {
        console.log("Error getting post.");
        return {error: "Error getting post.", "status": 500};
    }
}

async function handleDeletePost(options){
    try {
        if (!options.jwt || !options.username) {
            return {error: "You must be logged in to delete a post.", "status": 401};
        }

        let {postID, jwt} = options;

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'JWT': jwt
            }
        };

        let json = await serverRequest.makeRequest(`/posts/${postID}`, requestOptions);

        if (json.error) {
            return {"error": json.error, "status": json.status};
        }

        return { success: true, "status": 200 };

    } catch(error) {
        console.log("Error deleting post.", error);
        return {error: "Error deleting post.", "status": 500};
    }
}


async function handleWritePost(title, content, options){
    try {
        if (!options.jwt || !options.username) {
            return {error: "You must be logged in to post.", "status": 401};
        }

        let {boardName, username, jwt} = options;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'JWT': jwt
            },
            body: JSON.stringify({"boardName": boardName, "username": username, "title": title, "content": content})
        };

        let json = await serverRequest.makeRequest(`/posts`, requestOptions);

        console.log("status from handleWritePost: ", json.status)

        if (json.error) {
            return {"error": json.error, "status": json.status};
        }

        console.log("post successfully made: ", boardName);
        return { success: true, "status": 200 };

    } catch(error) {
        console.log("Error writing post.", error);
        return {error: "Error writing post.", status: 500};
    }
}


async function handleWriteComment(options){
    try {
        if (!options.jwt || !options.username || !options.comment || !options.postID) {
            return {error: "You must be logged in to comment.", "status": 401};
        }

        let {username, jwt, comment, postID} = options;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'JWT': jwt
            },
            body: JSON.stringify({"postID": postID, "username": username, "content": comment})
        };

        let json = await serverRequest.makeRequest(`/posts/comments`, requestOptions);

        console.log("server response from handleWriteComment: ", json);

        if (json.error) {
            return {"error": json.error, "status": json.status};
        }

        return { success: true , "status": 200};

    } catch(error) {
        console.log("Error writing comment.", error);
        return {error: "Error writing comment.", "status": 500};
    }
}
async function handleEditPost(postID, title, content, options){
    try {
        if (!options.jwt || !options.username) {
            return {error: "You must be logged in to edit a post.", "status": 401};
        }

        let {jwt} = options;

        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'JWT': jwt
            },
            body: JSON.stringify({"content": content})
        };

        let json = await serverRequest.makeRequest(`/posts/${postID}`, requestOptions);
        if (json.error) {
            return {"error": json.error, "post": json.post, "status": json.status};
        }

        return { success: true };

    } catch(error) {
        console.log("Error editing post.", error);
        return {error: "Error editing post.", "status": 500};
    }
}


module.exports = {
    handleGetPost: handleGetPost,
    handleWriteComment: handleWriteComment,
    handleWritePost: handleWritePost,
    handleDeletePost: handleDeletePost, 
    handleEditPost: handleEditPost
}