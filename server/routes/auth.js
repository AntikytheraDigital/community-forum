const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cors = require('cors');
const {google} = require('googleapis');
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

// Get the Google OAuth URL
router.get('/google/url', authController.getGoogleAuthURL);

// Handle the OAuth login request
router.get('/oauth/login', authController.handleOAuthLogin);

// Handle removing refresh token
router.get('/logout', authController.logout);

// Handle refreshing access token
router.get('/refresh', authController.getNewToken);

module.exports = router;
