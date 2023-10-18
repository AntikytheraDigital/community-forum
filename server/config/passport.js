const passport = require('passport');

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromHeader('JWT'),
    secretOrKey: process.env.JWT_SECRET
}

// const jwtStrategy = new JWTStrategy(jwtOptions, (jwtPayload, done) => {
//     // User.findOne({ email: email }, (err, user) => {
//     //     if (err) return done(err);
//     //     if (!user) return done(null, false, { message: 'Incorrect email' });
//     //     //if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password' });
//     //     return done(null, user);
//     // });
//     User.findById(jwtPayload.sub, (err, user) => {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     });
// })
//
// passport.use('jwt', jwtStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
