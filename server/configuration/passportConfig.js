const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CookieStrategy = require('passport-cookie');
const {authenticationService} = require('../service/authentication/authenticationService');
const {userService} = require('../service/user/userService');


passport.use(new CookieStrategy({
        cookieName: 'session-id',
        passReqToCallback: true
    },
    async function (cookie, token, done) {
        try {
            const user = await userService.findUserByEmail(cookie.session.passport.user);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }));
passport.use(new LocalStrategy(async function (email, password, done) {
    try {
        const response = await authenticationService.verifyPassword({email, password});
        return done(null, response);
    } catch (e) {
        return done(e);

    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(async function (email, done) {
    try {
        const userEntity = await userService.findUserByEmail(email);
        if (!userEntity) {
            return done('No user found', userEntity);
        }
        return done(null, userEntity);
    } catch (e) {
        return done(e);
    }

});
module.exports = passport;