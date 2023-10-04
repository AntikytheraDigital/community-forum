const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const cors = require('cors');
require('dotenv').config();

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl,
}))

// Edit post
router.patch('/edit/:postID', postController.editPost);

// add comment route   
router.post('/addComment', postController.addComment);

// edit comment route
router.patch('/editComment/:commentID', postController.editComment);

// delete comment route 
router.delete('/deleteComment/:commentID', postController.deleteComment);

// get post route 
router.get('/getPost/:postID', postController.getPost);

module.exports = router;