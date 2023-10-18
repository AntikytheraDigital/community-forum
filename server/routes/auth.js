const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

const appUrl = process.env.APP_URL || 'http://localhost:3005';

router.use(cors({
    origin: appUrl,
}))

// Registration
router.post('/register', authController.register);

// Login
router.post('/login', async (req, res) => {
    let {username, password} = req.body;

    // Authenticate user:
    const user = await User.findOne({username: username});

    if (!user) {
        return res.status(401).json({message: 'Incorrect username'});
    }

    if (!user.validPassword(password)) {
        return res.status(401).json({message: 'Incorrect password'});
    }

    // Generate JWT token
    const token = jwt.sign({username: username}, process.env.JWT_SECRET);

    console.log("Login successful for user: " + username);
    return res.status(200).json({JWT: token});
});

// check logged in and get username from JWT
router.get('/check', async (req, res) => {
    const token = req.headers.jwt;

    if (!token) {
        return res.status(401).json({message: 'User not logged in'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        console.log("User logged in: " + username);
        return res.status(200).json({username: username});
    } catch (e) {
        return res.status(401).json({message: 'User not logged in'});
    }
});

// Logout
router.get('/logout', authController.logout);

module.exports = router;
