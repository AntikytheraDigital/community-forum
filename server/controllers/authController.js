const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
    try {
        // Extract user registration data from the request body
        let {username, email, password} = req.body;

        // TODO: Add validation for email and password, e.g., check for required fields, valid email format, password complexity, etc.
        let savedUser;
        //This should probably be its own function
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) throw err;
                console.log(hash);
                password = hash;
                const newUser = new User({username, email, password});

                // Save the user to the database using await to handle the promise returned by save()
                savedUser = await newUser.save();
                console.log("Registered new user:" + savedUser);
            });
        });
        // Registration successful
        return res.status(201).json({message: 'Registration successful', user: savedUser});
    } catch (error) {
        // Registration failed
        return res.status(400).json({message: 'Registration failed', error: error.message});
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Handle error, e.g., database error
            return res.status(500).json({message: 'Login failed', error: err});
        }

        if (!user) {
            // Handle invalid login credentials
            return res.status(401).json({message: 'Invalid email or password'});
        }

        // Manually establish a session for the user
        req.login(user, (loginErr) => {
            if (loginErr) {
                // Handle session establishment error
                return res.status(500).json({message: 'Login failed', error: loginErr});
            }

            // Login successful
            return res.status(200).json({message: 'Login successful', user: user});
        });
    })(req, res, next); // Passport authentication middleware
};

exports.logout = (req, res) => {
    req.logout();
    // TODO: Redirect or respond as needed after logout
    res.status(200).json({message: 'Logout successful'});
};
