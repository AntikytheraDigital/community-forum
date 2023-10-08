const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const cors = require('cors');
require('dotenv').config();

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl,
}))

// create post
router.post('/createpost', boardController.createPost);

// delete post
router.delete('/deletepost/:postID', boardController.deletePost);

//get post ids 
router.get('/getposts/:boardID', boardController.getPosts);

router.get('/getallposts', boardController.getAllPosts);


module.exports = router;