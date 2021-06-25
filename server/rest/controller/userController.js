const express = require('express');
const router = express.Router();
const {userService} = require('../../service/user/userService');
const passport = require('../../configuration/passportConfig');

router.post('/create-account', passport.authenticate('local'), async function (req, res) {
    const response = await userService.createAccount(req.body);
    res.json(response);
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.end();
});
router.post('/guest', passport.authenticate('local-guest'), function (req, res) {
    res.end();
});

router.post('/logout', passport.authenticate('cookie'), function (req, res) {
    req.logout();
    req.session.destroy(() => {
        res.clearCookie('session-id');
        res.send();
    })
});

router.get('/my-boards', passport.authenticate('cookie', {session: false}), function (req, res) {
    res.json({message: "You're allowed to see this"});
});

router.get('/user-detail', passport.authenticate('cookie', {session: false}), function (req, res) {
    console.log(req.session);
    res.json({user: req.session});
});

router.delete('/delete', passport.authenticate('cookie'), function (req, res) {
});

module.exports = router;