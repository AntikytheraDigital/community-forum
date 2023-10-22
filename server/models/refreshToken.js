const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    username: {type: String, required: true},
    refreshToken: {type: String, required: true}
});

// Only one refresh token per user
refreshTokenSchema.pre('save', async function (next) {
    const username = this.username;
    await this.constructor.deleteMany({username: username});
    next();
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);