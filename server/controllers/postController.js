const Post = require('../models/post');

// expects the new posts content and title to be in the request body, and the postID to be in the parameters
// will not edit timestamp, authorID, or boardID
exports.editPost = async (req, res) => {
    console.log("Editing post...")
    try {
        //TODO check if user is the author of the post
        const postID = req.query.id;
        const newContent = req.body;
        let savedPost = await Post.findByIdAndUpdate(postID, {content: newContent});
        if (!savedPost) {
            throw new Error("post not found")
        }
        return (res.status(200).json({message: 'Post edited successfully', post: savedPost}));
    } catch (error) {
        return (res.status(400).json({message: 'Post creation failed', error: error.message}));
    }
};
exports.createPost = async (req, res) => {
    console.log("Creating new post.")

    try {
        let {boardName, username, content, title} = req.body;

        // if checks pass, create a new post
        const newPost = new Post({boardName, username, content, title});
        let savedPost = await newPost.save();

        return (res.status(201).json({message: 'Post created successfully', post: savedPost}));
    } catch (error) {
        return (res.status(400).json({message: 'Post creation failed', error: error.message}));
    }
};

// will return a post json from the post id in the request parameters
exports.getPost = async (req, res) => {
    console.log("getting post... ");

    try {
        const postID = req.query.id;

        if (!postID) {
            throw new Error("postID is required");
        }

        const post = await Post.findById(postID);

        if (!post) {
            throw new Error("post was not found");
        }
        return (res.status(200).json({message: "post retrieved successfully", post: post}));
    } catch (error) {
        return res.status(404).json({message: "post retrieval failed", error: error.message})
    }
};

exports.getAllPosts = async (req, res) => {
    console.log("getting all posts");

    try {
        const posts = await Post.find({}).sort({timestamp: -1});

        return (res.status(200).json({message: 'Post retrieval successful', posts: posts}));
    } catch (error) {
        return (res.status(400).json({message: 'Post retrieval failed', error: error.message}));
    }
}
exports.findByBoard = async (req, res) => {
    console.log("getting posts");

    try {
        const boardName = req.query.boardName;

        if (!boardName) {
            throw new Error("boardName is required");
        }

        // find all posts with the given boardID
        const posts = await Post.find({boardID: boardName}).sort({timestamp: -1});

        return (res.status(200).json({message: 'Post retrieval successful', posts: posts}));
    } catch (error) {
        return (res.status(400).json({message: 'Post retrieval failed', error: error.message}));
    }
};

exports.deletePost = async (req, res) => {
    console.log("Deleting post.")

    try {
        const postID = req.query.id;

        if (!postID) {
            throw new Error("postID is required");
        }

        const post = await Post.findByIdAndDelete(postID);

        if (!post) {
            throw new Error("post was not found and deleted successfully");
        }

        return (res.status(200).json({message: 'Post deleted successfully'}));
    } catch (error) {
        return (res.status(404).json({message: 'Post deletion failed', error: error.message}));
    }
};

exports.findByUser = async (req, res) => {
    console.log("getting posts by user, NOT IMPLEMENTED");
    return (res.status(501).json({message: 'Post retrieval by user not implemented'}));
}

exports.addComment = async (req, res) => {
    console.log("adding comment, NOT IMPLEMENTED");
    return (res.status(501).json({message: 'Comment addition not implemented'}));
}

exports.deleteComment = async (req, res) => {
    console.log("deleting comment, NOT IMPLEMENTED");
    return (res.status(501).json({message: 'Comment deletion not implemented'}));
}