const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const cors = require('cors');
require('dotenv').config();

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl,
}))
router.get('/findByUser', commentController.findByUser);
router.get('/findByPost', commentController.findByPost);
router.get('/:commentId', commentController.findByID);
router.delete('/:commentId', commentController.deleteComment);
router.patch('/:commentId', commentController.editComment);
router.post('', commentController.createComment);
module.exports = router;