const User = require('../models/user');
const validator = require('validator');
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || 'secret';

exports.register = async (req, res) => {
    console.log("Registering new user");
    try {
        // Extract user registration data from the request body
        let {username, email, password} = req.body;

        const validations = [
            {check: () => validator.isEmail(email), message: "invalid email"},
            {check: () => validator.isAlpha(username.charAt(0)), message: "username must start with a letter a-z or A-Z"},
            {check: () => validator.isAlphanumeric(username), message: "username must only contain letters and numbers"},
            {check: async () => !await User.exists({username: username}), message: "username already exists"},
            {check: async () => !await User.exists({email: email}), message: "email already in use"},
            {check: () => password.length >= 8 && password.length <=20, message: "password must be between 8-20 characters long"},
            {check: () => validator.isStrongPassword(password), message: "password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol"},
            {check: () => username.length >= 3 && username.length <=20, message: "username must be between 3 and 20 characters long"}
        ]

        for(let validation of validations){
            // if check function returns false, throw error
            if(!await validation.check()){
                console.log(validation.message);
                throw new Error(validation.message);
            }
        }
        const newUser = new User({username, email, password});

        // Save the user to the database using await to handle the promise returned by save()
        let savedUser= await newUser.save();
        console.log("Registered new user:" + savedUser);

        // Registration successful
        return res.status(201).json({message: 'Registration successful'});
    } catch (error) {
        // Registration failed
        return res.status(400).json({message: 'Registration failed', error: error.message});
    }
};

exports.addOAuthUser = async (req, res) => {
    try {
        // if email already exists, return error
        if (await User.exists({email: req.body.email})) {
            return res.status(400).json({message: 'Email already in use'});
        }

        // Create username from email
        let username = req.body.email.split('@')[0];

        // if username already exists, append random number to username
        if (await User.exists({username: username})) {
            username = username + Math.floor(Math.random() * 10000);
        }

        // Create new user
        const newUser = new User({username: username, email: req.body.email});
        let savedUser = await newUser.save();
        console.log("Registered new user:" + savedUser);
        return res.status(201).json({message: 'Registration successful'});
    } catch (error) {
        return res.status(400).json({message: 'Registration failed', error: error.message});
    }
}

exports.login = async (req, res) => {
    let {username, password} = req.body;

    // Authenticate user
    const user = await User.findOne({username: username});

    if (!user) {
        return res.status(401).json({message: 'Incorrect username'});
    }

    if (!user.validPassword(password)) {
        return res.status(401).json({message: 'Incorrect password'});
    }

    // Generate JWT token TODO: Set up refresh tokens with short rotations
    const token = jwt.sign({username: username}, jwtSecret, {expiresIn: '1h'});

    console.log("Login successful for user: " + username);
    return res.status(200).json({JWT: token});
};

exports.checkLoggedIn = async (req, res) => {
    const token = req.headers.jwt;

    if (!token) {
        return res.status(401).json({message: 'User not logged in'});
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        return res.status(200).json({username: decoded.username});
    } catch (e) {
        return res.status(401).json({message: 'User not logged in'});
    }
}

exports.getGoogleAuthURL = async (req, res) => {
    // if any env vars are missing, return error
    if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET || !process.env.OAUTH_REDIRECT) {
        return res.status(400).json({error: 'OAuth env vars not set'});
    }

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: `${process.env.OAUTH_REDIRECT}`,
        client_id: process.env.OAUTH_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    };

    const url = `${rootUrl}?${new URLSearchParams(options)}`;
    return res.status(200).json({url: url});
}