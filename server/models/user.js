const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: false}
});

userSchema.pre('save', async function (next) {
    // Skip password hashing if OAuth
    if (this.password === undefined) {
        return next();
    }

    let password = this.password;
    try {
        password = await bcrypt.hash(password, 10);
    } catch (err) {
        return next(err);
    }
    this.password = password;
    next();
});

userSchema.methods.validPassword = function (plainPassword) {
    return bcrypt.compareSync(plainPassword, this.password);
};

userSchema.methods.isOAuth = function () {
    return this.password === undefined;
}

module.exports = mongoose.model('User', userSchema);
