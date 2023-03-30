const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CookieStrategy = require('passport-cookie');
const {authenticationService} = require('../server/service/authentication/authenticationService');
const {findUserBySession} = require("../server/service/user/userService");
const CustomStrategy = require('passport-custom').Strategy;

passport.use('cookie', new CookieStrategy({
        cookieName: 'connect.sid',
        passReqToCallback: true
    },
    async function (req, token, done) {
        try {
            const user = await findUserBySession(req.sessionID);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }));
passport.use('local', new LocalStrategy(async function (email, password, done) {
    try {
        const response = await authenticationService.verifyPassword({email, password});
        return done(null, response);
    } catch (e) {
        return done(e);

    }
}));

passport.use('local-guest', new CustomStrategy(function (req, done) {
    try {
        const user = {
            ...req.body,
            role: 'guest'
        }
        return done(null, user);
    } catch (e) {
        return done(e);

    }
}));

passport.serializeUser(function (user, done) {
    const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    }
    done(null, data);
});

passport.deserializeUser(async function (req, user, done) {
    try {
        const userEntity = await findUserBySession(req.sessionID);
        if (!userEntity) {
            return done('No user found for email', null);
        }
        done(null, userEntity);
    } catch (e) {
        return done(e);
    }
});
module.exports = passport;
