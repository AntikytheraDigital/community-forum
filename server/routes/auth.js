const express = require('express');
const passport = require('passport');
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
router.get('/login', passport.authenticate('local'), authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
