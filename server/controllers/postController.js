const Post = require('../models/post');
const Comment = require('../models/comment');


// expects the new posts content and title to be in the request body, and the postID to be in the parameters
// will not edit timestamp, authorID, or boardID

exports.editPost = async (req, res) => {
    console.log("Editing post...")

    try{
        const postID = req.query.id;
        const {content, title} = req.body;

        const validations = [
            {check: () => content, message: "post must have content in the body"},
            {check: () => title, message: "title is required"},
            {check: () => title.length >= 3 && title.length <=30, message: "title must be between 3 and 30 characters long"}
        ]

        for(let valdation of validations){
            if(!await valdation.check()){
                console.log(validation.message);
                throw new Error(validation.message);
            }
        }

        // if checks pass, edit the post 
        let savedPost = await Post.findByIdAndUpdate(postID, {content:content, title:title}, {new: true});
        
        if(!savedPost){
            throw new Error("post was not found and edited successfully");
        }

        return(res.status(200).json({message: 'Post edited successfully', post: savedPost}));
    } catch(error){
        return(res.status(404).json({message: 'Post creation failed', error: error.message}));
    }
};

exports.addComment = async (req, res) => {
    console.log("Adding comment...")

    try{
        const {postID, authorID, content, timestamp} = req.body;

        const validations = [
            {check: () => postID, message: "postID is required"}, //should never be seen by user, but a good internal check 
            {check: () => authorID, message: "authorID is required"}, //should never be seen by user, but a good internal check 
            {check: () => content, message: "comment must have content in the body"},
            {check: () => timestamp, message: "timestamp is required"}, //should never be seen by user, but a good internal check 
        ]

        for(let valdation of validations){
            if(!await valdation.check()){
                console.log(validation.message);
                throw new Error(validation.message);
            }
        }

        // if checks pass, create a new comment 
        const newComment = new Comment({postID, authorID, content, timestamp});
        let savedComment = await newComment.save();

        return(res.status(201).json({message: 'Comment created successfully', comment: savedComment}));
    } catch(error){
        return(res.status(400).json({message: 'Comment creation failed', error: error.message}));
    }
};

exports.editComment = async (req, res) => {
    console.log("editing comment ...");

    try{
        const commentID = req.query.id;
        const {content} = req.body;

        const validations = [
            {check: () => content, message: "comment must have content in the body"},
        ]

        for(let validation of validations){
            if(!await validation.check()){
                console.log(validation.message);
                throw new Error(validation.message);
            }
        }

        // if checks pass, edit the comment
        let editedComment = await Comment.findByIdAndUpdate(commentID, {content:content}, {new: true});

        if(!editedComment){
            throw new Error("comment was not found and edited successfully");
        }
        return(res.status(200).json({message: 'Comment edited successfully', comment: editedComment}));
    }catch(error){
        return(res.status(404).json({message: 'Comment edit failed', error: error.message}));
    }
};

exports.deleteComment = async (req, res) => {
    console.log("deleting comment... ");

    try{
        const commentID = req.query.id;

        if(!commentID){
            throw new Error("commentID is required");
        }

        const isGone = await Comment.findByIdAndDelete(commentID);

        if(!isGone){
            throw new Error("comment was not found and deleted successfully");
        }
        return(res.status(200).json({messae: "comment deleted successfully"}));
    }catch(error){
        return res.status(404).json({message: "comment deletion failed", error: error.message})
    }
};

// will return a post json from the post id in the request parameters
exports.getPost = async (req, res) => {
    console.log("getting post... ");

    try{
        const postID = req.query.id;

        if(!postID){
            throw new Error("postID is required");
        }

        const post = await Post.findById(postID);

        if(!post){
            throw new Error("post was not found");
        }
        return(res.status(200).json({message: "post retrieved successfully", post: post}));
    }catch(error){
        return res.status(404).json({message: "post retrieval failed", error: error.message})
    }
};
