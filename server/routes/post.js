const express = require('express');
const router = express.Router();
const {getUsername, authenticateRequest} = require('../controllers/postController');
const postController = require('../controllers/postController');
const cors = require('cors');
require('dotenv').config();

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl
}))

router.post('', getUsername, authenticateRequest, postController.createPost);

router.get('/all', postController.getAllPosts);

router.get('/findByBoard', postController.findByBoard);

router.post('/comments', getUsername, authenticateRequest, postController.addComment);

router.patch('/:postID', getUsername, authenticateRequest, postController.editPost);

router.get('/:postID', postController.getPost);

router.delete('/:postID', getUsername, authenticateRequest, postController.deletePost);

module.exports = router;
