const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const boardRoutes = require('./routes/board');
const {connectDatabase} = require("./models/database");
require('dotenv').config();
const app = express();
connectDatabase().then(() => {
    console.log("Database connected");
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false}));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/boards', boardRoutes);

const PORT = process.env.PORT || 3000;

module.exports = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});