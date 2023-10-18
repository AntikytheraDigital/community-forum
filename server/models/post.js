const mongoose = require('mongoose');
const User = require('./user');
const Board = require('./board');

const commentSchema = new mongoose.Schema({
    username: {type: String, required: true}, // username is a foreign key to the User model
    timestamp: {type: String, required: true},
    content: {type: String, required: true}
});

commentSchema.pre('validate', async function (next) {
    if (!this.timestamp) {
        this.timestamp = Date.now();
    }
    next();
});

commentSchema.path('username').validate(async function (value) {
    const user = await User.findOne({username: value});
    return user !== null;
}, 'Invalid username');

const postSchema = new mongoose.Schema({
    boardName: {type: String, required: true}, // boardName is a foreign key to the Board model
    username: {type: String, required: true}, // username is a foreign key to the User model
    content: {type: String, required: true},
    timestamp: {type: Date, required: true},
    title: {type: String, required: true, minLength: 3, maxLength: 50},
    comments: {type: [commentSchema], required: false}
});

postSchema.pre('validate', async function (next) {
    if (!this.timestamp) {
        this.timestamp = Date.now();
    }
    next();
});

postSchema.path('username').validate(async function (value) {
    const user = await User.findOne({username: value});
    return user !== null;
}, 'Invalid username');

postSchema.path('boardName').validate(async function (value) {
    const board = await Board.find({name: value})
    return board !== null;
}, 'Invalid boardName');

module.exports = mongoose.model('Post', postSchema);
