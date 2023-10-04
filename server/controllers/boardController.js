//const Board = require('../models/board');
const Post = require('../models/post');

exports.createPost = async (req, res) => {
    console.log("Creating new post.")

    try{
        let {boardID, authorID, content, timestamp, title} = req.body;
        
        const validations = [
            {check: () => boardID, message: "boardID is required"}, //should never be seen by user, but a good internal check 
            {check: () => authorID, message: "authorID is required"}, //should never be seen by user, but a good internal check 
            {check: () => content, message: "post must have content in the body"},
            {check: () => timestamp, message: "timestamp is required"}, //should never be seen by user, but a good internal check 
            {check: () => title, message: "title is required"},
            {check: () => title.length >= 3 && title.length <=30, message: "title must be between 3 and 30 characters long"}
        ]

        for(let validation of validations){
            if(!await validation.check()){
                console.log(validation.message);
                throw new Error(validation.message);
            }
        }

        // if checks pass, create a new post 
        const newPost = new Post({boardID, authorID, content, timestamp, title});
        let savedPost = await newPost.save();

        return(res.status(201).json({message: 'Post created successfully', post: savedPost}));
    } catch(error){
        return(res.status(400).json({message: 'Post creation failed', error: error.message}));
    }
};

exports.deletePost = async (req, res) => {
    console.log("Deleting post.")

    try{
        const {postID} = req.params; 

        if(!postID){
            throw new Error("postID is required");
        } 

        // post will = true if the post has been successfully deleted 
        const post = await Post.findByIdAndDelete(postID);

        if(!post){
            throw new Error("post was not found and deleted successfully");
        }

        return(res.status(200).json({message: 'Post deleted successfully'}));
    } catch(error){
        return(res.status(404).json({message: 'Post deletion failed', error: error.message}));
    }
};

// returns all postIDs for a given boardID
exports.getPosts = async (req, res) => {
    console.log("getting posts");

    try{
        const {boardID} = req.params;

        if(!boardID){
            throw new Error("boardID is required");
        }

        // find all posts with the given boardID
        const postIDs = await Post.find({boardID: boardID});

        return (res.status(200).json({message: 'Post retrieval successful', postIDs: postIDs}));


    }catch(error){
        return (res.status(400).json({message: 'Post retrieval failed', error: error.message}));
    }
};




