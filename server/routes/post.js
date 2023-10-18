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

router.post('/comments', postController.addComment);

router.delete('/comments', postController.deleteComment);

router.patch('', postController.editPost);

router.get('', postController.getPost);

router.delete('', postController.deletePost);

router.patch('', postController.editPost);

module.exports = router;
