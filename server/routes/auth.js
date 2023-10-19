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

function getGoogleAuthURL() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: `${process.env.OAUTH_REDIRECT}`,
        client_id: process.env.OAUTH_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    };

    return `${rootUrl}?${new URLSearchParams(options)}`;
}

router.get('/google/url', (req, res) => {
    res.redirect(getGoogleAuthURL())
});

router.get('/oauth', (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        process.env.OAUTH_REDIRECT
    );

    const code = req.query.code;

    oauth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return res.status(400).json({message: 'Error retrieving access token'});
        }

        oauth2Client.setCredentials(token);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        oauth2.userinfo.get((err, response) => {
            if (err) {
                console.error('Error retrieving user info', err);
                return res.status(400).json({message: 'Error retrieving user info'});
            }

            // TODO: Remove profile from consent oauth
            console.log(response.data)
            const {email} = response.data;
            console.log("test: ", email);

            // print access token
            console.log(token.access_token);

            // redirect
            res.redirect(appUrl);
        });
    });
});

module.exports = router;
