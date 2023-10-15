const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const cors = require('cors');
require('dotenv').config();

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl,
}))

router.post('', postController.createPost);

router.get('/all', postController.getAllPosts);

router.get('/findByBoard', postController.findByBoard);

router.get('/findByUser', postController.findByUser);

router.post('/comment', postController.addComment);

router.delete('/comment', postController.deleteComment);

router.patch('/:postID', postController.editPost);

router.get('/:postID', postController.getPost);

router.delete('/:postID', postController.deletePost);

router.patch('/:postID', postController.editPost);

module.exports = router;
