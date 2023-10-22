const User = require('../models/user');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const {google} = require('googleapis');
const RefreshToken = require('../models/refreshToken');

const jwtSecret = process.env.JWT_SECRET || 'secret';
const refreshSecret = process.env.REFRESH_SECRET || 'refreshSecret';

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

async function addOAuthUser (email) {
    try {
        // if email already exists, return error
        if (await User.exists({email: email})) {
            return {error: "Email already in use", status: 400};
        }

        // Create username from email
        let username = email.split('@')[0];

        // if username already exists, append random number to username
        if (await User.exists({username: username})) {
            username = username + Math.floor(Math.random() * 10000);
        }

        // Create new user
        const newUser = new User({username: username, email: email});
        let savedUser = await newUser.save();
        console.log("Registered new user:" + savedUser);
        return {message: "Registration successful", status: 201, username: username};
    } catch (error) {
        return {error: "Registration failed", status: 400};
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

    // Generate JWT token and refresh token
    const token = generateToken(username);
    const refreshToken = jwt.sign(username, refreshSecret);

    const newRefToken = new RefreshToken({username: username, refreshToken: refreshToken});
    await newRefToken.save();

    console.log("Login successful for user: " + username);
    return res.status(200).json({JWT: token, username: username, refreshToken: refreshToken});
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

exports.getNewToken = async (req, res) => {
    try {
        const refreshToken = req.headers.refreshtoken;

        if (!refreshToken) {
            return res.status(401).json({message: 'User not logged in'});
        }

        if (!await RefreshToken.exists({refreshToken: refreshToken})) {
            return res.status(401).json({message: 'User not logged in'});
        }

        const decoded = jwt.verify(refreshToken, refreshSecret);
        const token = generateToken(decoded.username);

        return res.status(200).json({JWT: token, username: decoded.username });
    } catch (e) {
        return res.status(401).json({message: 'User not logged in'});
    }
}

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.headers.refreshtoken;

        console.log("Logging out user with refresh token: " + refreshToken)

        if (!refreshToken) {
            return res.status(400).json({message: 'Logout failed'});
        }

        if (!await RefreshToken.exists({refreshToken: refreshToken})) {
            return res.status(400).json({message: 'Logout failed'});
        }

        await RefreshToken.deleteOne({refreshToken: refreshToken});

        return res.status(200).json({message: 'User logged out'});
    } catch (e) {
        return res.status(400).json({message: 'Logout failed'});
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

async function getUserInfo(code) {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.OAUTH_CLIENT_ID,
            process.env.OAUTH_CLIENT_SECRET,
            process.env.OAUTH_REDIRECT
        );

        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({auth: oauth2Client, version: 'v2'});
        const userInfo = await oauth2.userinfo.get();

        if (!userInfo.data.email) {
            return {error: "Error retrieving user email", status: 500};
        }

        return userInfo.data;
    } catch (e) {
        console.log(e);
        return {error: "Error retrieving user info", status: 500};
    }
}

exports.handleOAuthLogin = async (req, res) => {
    const code = req.query.code;

    const userInfo = await getUserInfo(code);

    if (userInfo.error) {
        return res.status(userInfo.status).json({message: userInfo.error});
    }

    const email = userInfo.email;
    console.log("Logging in user with email: " + email);

    // Find user with email
    let user = await User.findOne({email: email});
    let username;

    if (!user) {
        // Create new user
        const oauthResponse = await addOAuthUser(email);
        if (oauthResponse.error) {
            return res.status(oauthResponse.status).json({message: oauthResponse.error});
        }

        username = oauthResponse.username;
    } else {
        // If user exists, check if user is oauth user
        if (!user.isOAuth()) {
            return res.status(400).json({message: "Email already in use"});
        }

        username = user.username;
    }

    const token = generateToken(username);
    const refreshToken = jwt.sign(username, refreshSecret);

    const newRefToken = new RefreshToken({username: username, refreshToken: refreshToken});
    await newRefToken.save();

    console.log("Login successful for user: " + username);
    return res.status(200).json({JWT: token, username: username, refreshToken: refreshToken});
}

function generateToken(username) {
    return jwt.sign({username: username}, refreshSecret, {expiresIn: '12m'});
}