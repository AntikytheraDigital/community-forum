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
router.post('/deletepost', boardController.deletePost);

module.exports = router;