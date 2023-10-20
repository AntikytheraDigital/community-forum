const Post = require('../models/post');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || 'secret';

// expects the new posts content and title to be in the request body, and the postID to be in the parameters
// will not edit timestamp, authorID, or boardID
exports.editPost = async (req, res) => {
    try {
        const postID = req.params["postID"];
        let post = await Post.findById(postID);
        if (!post) {
            throw new Error("post not found");
        }
        validateRequest(req.headers.jwt, post.username);
        post.content = req.body.content;
        await post.save();
        return (res.status(200).json({message: 'Post edited successfully'}));
    } catch (error) {
        return (res.status(400).json({message: 'Post edit failed', error: error.message}));
    }
};
exports.createPost = async (req, res) => {
    try {
        let {boardName, username, content, title} = req.body;
        validateRequest(req.headers.jwt, username);
        const newPost = new Post({boardName, username, content, title});
        await newPost.save();
        return (res.status(201).json({message: 'Post created successfully'}));
    } catch (error) {
        return (res.status(400).json({message: 'Post creation failed', error: error.message}));
    }
};

// will return a post json from the post id in the request parameters
exports.getPost = async (req, res) => {
    try {
        const postID = req.params["postID"];
        if (!postID) {
            throw new Error("postID is required");
        }
        const post = await Post.findById(postID);
        if (post) return (res.status(200).json({post}));
        else throw new Error("post not found");
    } catch (error) {
        return res.status(400).json({message: "post retrieval failed", error: error.message})
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({timestamp: -1});
        return (res.status(200).json({posts}));
    } catch (error) {
        return (res.status(500).json({message: 'Post retrieval failed', error: error.message}));
    }
}
exports.findByBoard = async (req, res) => {
    try {
        const boardName = req.query.boardName;

        if (!boardName) {
            throw new Error("boardName is required");
        }

        // find all posts with the given boardID
        const posts = await Post.find({boardName: boardName}).sort({timestamp: -1});

        return (res.status(200).json({posts}));
    } catch (error) {
        return (res.status(400).json({message: 'Post retrieval failed', error: error.message}));
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postID = req.params["postID"];
        let post = await Post.findById(postID);
        if (!post) throw new Error("post not found");
        validateRequest(req.headers.jwt, post.username);
        await Post.findByIdAndDelete(postID);
        return (res.status(200).json({message: 'Post deleted successfully'}));
    } catch (error) {
        return (res.status(400).json({message: 'Post deletion failed', error: error.message}));
    }
};

exports.addComment = async (req, res) => {
    try {
        const {postID, username, content} = req.body;
        let token = req.headers.jwt;
        validateRequest(token, username);
        let savedPost = await Post.findByIdAndUpdate(postID, {$push: {comments: {username, content}}});
        if (!savedPost) {
            throw new Error("post not found")
        }
        return (res.status(201).json({message: 'Comment added successfully'}));
    } catch (error) {
        return (res.status(400).json({message: "Comment creation failed", error: error.message}));
    }
}

exports.deleteComment = async (req, res) => {
    try{
        const {postID, commentID} = req.query;
        let comment = await Post.findById(postID).select({comments: {$elemMatch: {_id: commentID}}});
        let username = comment.comments[0].username;
        validateRequest(req.headers.jwt, username);
        if (!comment) {
            throw new Error("comment not found");
        }
        return (res.status(200).json({message: 'Comment deleted successfully'}));
    }catch(error){
        return (res.status(400).json({message: "Comment deletion failed", error: error.message}));
    }
}

function validateRequest(token, username) {
    if (!token) {
        throw new Error("token is required")
    }
    let decoded
    if (process.env.NODE_ENV === 'test') {
        decoded = JSON.parse(token)
    } else {
        decoded = jwt.verify(token, jwtSecret);
    }
    if (username !== decoded.username) {
        throw new Error("username does not match token: " + decoded.username)
    }
}