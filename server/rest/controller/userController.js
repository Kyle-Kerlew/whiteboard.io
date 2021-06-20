const express = require('express');
const router = express.Router();
const {userService} = require('../../service/user/userService');
const passport = require('../../configuration/passportConfig');

router.post('/create-account', passport.authenticate('local'), async function (req, res) {
    const response = await userService.createAccount(req.body);
    res.json(response);
});

router.post('/login', passport.authenticate('local'), async function (req, res) {
    res.end();
});

router.get('/list', passport.authenticate('cookie', {session: false}), async function (req, res) {
    res.json({message: "You're allowed to see this"});
});

router.get('/user-detail', passport.authenticate('cookie', {session: false}), async function (req, res) {
    console.log(req.session);
    res.json({user: req.session});
});

router.get('/authenticated', passport.authenticate('cookie', {session: false}));

router.delete('/delete', passport.authenticate('cookie'), function (req, res) {
});

module.exports = router;