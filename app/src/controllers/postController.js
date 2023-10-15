const url = process.env.SERVER_URL || 'http://localhost:3000';

async function handleGetPost(postID){
    return {error: "Not implemented."};
}

module.exports = {
    handleGetPost: handleGetPost
}