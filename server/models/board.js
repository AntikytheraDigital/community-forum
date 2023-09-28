const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    boardName: {type: String, required: true},
    boardDescription: {type: String, required: true}
});
