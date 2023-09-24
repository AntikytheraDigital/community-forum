const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
const validator = require('validator');

exports.register = async (req, res, next) => {
    try {
        // for testing, print out contents of db (only gonna work if theres actually a user obv)
        const users = await User.find({});
        console.log("PRINGINGG")
        console.log(users); 
        
        // Extract user registration data from the request body
        let {username, email, password} = req.body;

        const validations = [ 
            {check: () => validator.isEmail(email), message: "invalid email"},
            {check: () => password.length >= 8 && password.length <=20, message: "password must be between 8-20 characters long"},
            {check: () => username.length >= 3 && username.length <=20, message: "username must be between 3 and 20 characters long"}, 
            {check: () => validator.isAlpha(username.charAt(0)), message: "username must start with a letter a-z or A-Z"},
            {check: () => validator.isAlphanumeric(username), message: "username must only contain letters and numbers"},
            {check: () => validator.isStrongPassword(password), message: "password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol"},
            {check: () => !User.findOne({username: username}), message: "username already exists"}, 
            {check: () => !User.findOne({email: email}), message: "email already exists"} 
            // still need to implement check that the email user and password fields actually exist/recieved data i think? 
        ]
        

        for(let validation of validations){
            // if check function returns false, throw error
            if(!validation.check()){
                console.log(validation.message);
                throw new Error(validation.message);
            }
        }


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

        // // possible alternative to the bcrpt code above 
        // const salt = await bcrypt.genSalt(10);
        // const hash = await bcrypt.hash(password, salt);
        // const newUser = new User({username, email, password: hash});
        // const savedUser = await newUser.save();

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
