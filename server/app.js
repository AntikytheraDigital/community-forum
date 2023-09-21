const express = require('express');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const mongoose = require("mongoose");

require('dotenv').config();

const app = express();

if (process.env.ATLAS_URI) {
    mongoose.connect(process.env.ATLAS_URI)
} else {
    throw 'configure ATLAS_URI in .env'
}
const db = mongoose.connection
db.on('error', err => {
    console.log(`There was an error connecting to the database: ${err}`)
})
db.once('open', () => {
    console.log(`Successfully connected to database`)
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});