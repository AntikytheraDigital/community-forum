const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const cors = require('cors');
require('dotenv').config();

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl,
}))
router.get('/findByBoard', postController.findByBoard);

router.get('/findByUser', postController.findByUser);

router.patch('/:postID', postController.editPost);

router.get('/:postID', postController.getPost);

router.delete('/:postID', postController.deletePost);

router.patch('/:postID', postController.editPost);

router.get('', postController.getAllPosts);

router.post('', postController.createPost);

module.exports = router;
