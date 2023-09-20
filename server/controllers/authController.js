const User = require('../models/user');
const passport = require('passport');

exports.register = async (req, res, next) => {
    try {
        // Extract user registration data from the request body
        const { username, email, password } = req.body;

        // TODO: Add validation for email and password, e.g., check for required fields, valid email format, password complexity, etc.

        // Create a new User instance
        const newUser = new User({ username, email, password });

        // TODO: Hash the password before saving it to the database for security.
        // You may want to use a library like bcrypt to hash the password.

        // Save the user to the database using await to handle the promise
        const savedUser = await newUser.save();

        // Registration successful
        return res.status(201).json({ message: 'Registration successful', user: savedUser });
    } catch (error) {
        // Handle registration error, e.g., duplicate email
        return res.status(400).json({ message: 'Registration failed', error: error.message });
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Handle error, e.g., database error
            return res.status(500).json({ message: 'Login failed', error: err });
        }

        if (!user) {
            // Handle invalid login credentials
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Manually establish a session for the user
        req.login(user, (loginErr) => {
            if (loginErr) {
                // Handle session establishment error
                return res.status(500).json({ message: 'Login failed', error: loginErr });
            }

            // Login successful
            return res.status(200).json({ message: 'Login successful', user: user });
        });
    })(req, res, next); // Passport authentication middleware
};

exports.logout = (req, res) => {
    req.logout();
    // TODO: Redirect or respond as needed after logout
    res.status(200).json({ message: 'Logout successful' });
};
