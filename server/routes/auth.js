const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const cors = require('cors');
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

    console.log("Login successful for user: " + username);
    return res.status(200).json({message: 'Login successful'});
});

// Logout
router.get('/logout', authController.logout);

module.exports = router;
