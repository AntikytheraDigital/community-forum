const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const cors = require('cors');
require('dotenv').config();

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl,
}))

router.get(':/boardName', boardController.getBoardByName);

router.get('', boardController.getAllBoards);

router.post('', boardController.createBoard);

router.delete('', boardController.deleteBoard);

module.exports = router;