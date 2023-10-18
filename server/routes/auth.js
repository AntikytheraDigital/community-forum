const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cors = require('cors');
require('dotenv').config();

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl,
}))

// Registration
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// check logged in
router.get('/check', authController.checkLoggedIn);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
