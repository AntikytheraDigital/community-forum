const Post = require('../models/post');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || 'secret';

// expects the new posts content and title to be in the request body, and the postID to be in the parameters
// will not edit timestamp, authorID, or boardID
exports.editPost = async (req, res) => {
    try {
        let post = req.post;
        if (!post) {
            throw new Error("post not found");
        }

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
        if (post) return (res.status(200).json({post})); else throw new Error("post not found");
    } catch (error) {
        return res.status(400).json({message: "post retrieval failed", error: error.message})
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({timestamp: -1}).limit(50);
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
        const posts = await Post.find({boardName: boardName}).sort({timestamp: -1}).limit(50);

        return (res.status(200).json({posts}));
    } catch (error) {
        return (res.status(400).json({message: 'Post retrieval failed', error: error.message}));
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postID = req.params["postID"];
        let post = req.post;
        if (!post) throw new Error("post not found");

        await Post.findByIdAndDelete(postID);
        return (res.status(200).json({message: 'Post deleted successfully'}));
    } catch (error) {
        return (res.status(400).json({message: 'Post deletion failed', error: error.message}));
    }
};

exports.addComment = async (req, res) => {
    try {
        const {postID, username, content} = req.body;

        if (!content || content === "") {
            throw new Error("content is required")
        }

        let post = await Post.findById(postID).exec();
        if (!post) {
            throw new Error("post not found")
        }
        post.comments.push({username, content});
        await post.save();
        return (res.status(201).json({message: 'Comment added successfully'}));
    } catch (error) {
        return (res.status(400).json({message: "Comment creation failed", error: error.message}));
    }
}

exports.getUsername = async (req, res, next) => {
    if (req.body.username) {
        req.username = req.body.username;
        next();
        return;
    }

    if (req.body.username === "") {
        return (res.status(400).json({message: "username is required"}));
    }

    if (!req.params["postID"]) {
        return (res.status(400).json({message: "postID is required"}));
    }

    const postID = req.params["postID"];
    let post;
    try {
        post = await Post.findById(postID);
    } catch (error) {
        return (res.status(400).json({message: "postID is invalid"}));
    }

    if (!post) {
        return (res.status(400).json({message: "post not found"}));
    }

    req.username = post.username;
    req.post = post;
    next();
}

exports.authenticateRequest = (req, res, next) => {
    const token = req.headers.jwt;
    const username = req.username;

    if (!token || !username) {
        return res.status(401).json({ message: "Both token and username are required." });
    }

    let decoded;

    if (process.env.NODE_ENV === 'test') {
        try {
            decoded = JSON.parse(token);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token format." });
        }
    } else {
        try {
            decoded = jwt.verify(token, jwtSecret);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token." });
        }
    }

    if (username !== decoded.username) {
        return res.status(401).json({ message: "Username does not match the token." });
    }

    next();
}