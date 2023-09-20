const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration
router.post('/register', authController.register);

// Login
router.get('/login', passport.authenticate('local'), authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
