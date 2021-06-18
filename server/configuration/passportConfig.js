const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {authenticationService} = require('../service/authentication/authenticationService');
const {userService} = require('../service/user/userService');


passport.use('local', new LocalStrategy({},
    async function (email, password, done) {
        try {
            const response = await authenticationService.verifyPassword({email, password});
            return done(null, response);
        } catch (e) {
            return done(null, false, {error: 'Invalid Credentials'});

        }
    }));

passport.serializeUser(function (user, done) {
    console.log(user);
    done(null, user.email);
});

passport.deserializeUser(async function (email, done) {
    try {
        const userEntity = await userService.findUserByEmail(email);
        done(undefined, userEntity);
    } catch (e) {
        done(e, undefined);
    }

});
module.exports = passport;