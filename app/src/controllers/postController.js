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


// async function handleWriteComment(postID, comment, username, jwt){
//     try {
//         const requestOptions = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'JWT': jwt
//             },
//             body: JSON.stringify({"postID": postID, "username": username, "content": comment, "timestamp": new Date()})
//         };

//         let json = await serverRequest.makeRequest(`/posts/comments`, requestOptions);
//         console.log("Raw server response:", json);
     
//         console.log("GOT TO LINE 42");

//         if (json.error) {
//             return {"error": json.error}
//         }
        
//         console.log("GOT TO LINE 46");

//         //let post = json["post"];
//         // let date = new Date(post["timestamp"]);
//         // post["timestamp"] = date.toLocaleString();
//         // console.log("POST BEING RETURNED: ", post);
//         //return post;

//     } catch(error) {
//         console.log("Error writing comment.", error);
//         return {error: "Error writing comment."}
//     }
// }

async function handleWriteComment(postID, comment, username, jwt){
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'JWT': jwt
            },
            body: JSON.stringify({"postID": postID, "username": username, "content": comment, "timestamp": new Date()})
        };

        let json = await serverRequest.makeRequest(`/posts/comments`, requestOptions);

        if (json.error) {
            return {"error": json.error};
        }

        return { success: true };

    } catch(error) {
        console.log("Error writing comment.", error);
        return {error: "Error writing comment."};
    }
}



module.exports = {
    handleGetPost: handleGetPost,
    handleWriteComment: handleWriteComment
}