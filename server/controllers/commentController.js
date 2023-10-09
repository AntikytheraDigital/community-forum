const Comment = require('../models/comment');

exports.createComment = async (req, res) => {
    console.log("Adding comment...")

    try{
        const {postID, authorID, content, timestamp} = req.body;

        const validations = [
            {check: () => postID, message: "postID is required"}, //should never be seen by user, but a good internal check
            {check: () => authorID, message: "authorID is required"}, //should never be seen by user, but a good internal check
            {check: () => content, message: "comment must have content in the body"},
            {check: () => timestamp, message: "timestamp is required"}, //should never be seen by user, but a good internal check
        ]

        for(let validation of validations){
            if(!await validation.check()){
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

exports.findByUser = async (req, res) => {
    console.log("finding comments from user, NOT IMPLEMENTED");
    return (res.status(500).json({message: 'Comment retrieval by user not implemented'}));
}

exports.findByPost = async (req, res) => {
    console.log("finding comments from post, NOT IMPLEMENTED");
    return (res.status(500).json({message: 'Comment retrieval by post not implemented'}));
}

exports.findByID = async (req, res) => {
    console.log("finding comment by id, NOT IMPLEMENTED");
    return (res.status(500).json({message: 'Comment retrieval by id not implemented'}));
}