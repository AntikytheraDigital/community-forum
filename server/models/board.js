const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    boardName: {
        type: String,
        required: true,
        unique: true
    },
    boardDescription: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Board', boardSchema);