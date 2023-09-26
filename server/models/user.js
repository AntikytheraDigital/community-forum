const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

userSchema.pre('save', async function (next) {
    let password = this.password;
    try {
        password = await bcrypt.hash(password, 10);
    } catch (err) {
        return next(err);
    }
    this.password = password;
    console.log("Hashed password: " + this.password);
    next();
});

module.exports = mongoose.model('User', userSchema);
