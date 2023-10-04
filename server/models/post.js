const mongoose = require('mongoose');

// ID ending names indicate that the attribute is the _id generated by MongoDB 
// and is a reference to another document in a collection (i.e. a foreign key)

const postSchema = new mongoose.Schema({
    boardID: {type: String, required: true},
    authorID: {type: String, required: true}, 
    content: {type: String, required: true},
    timestamp: {type: Date, required: true},
    title: {type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);
