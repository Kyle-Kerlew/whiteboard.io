const express = require('express');
const router = express.Router();
const {userService} = require('../../service/user/userService');
const passport = require('../../configuration/passportConfig');

router.post('/create-account', async function (req, res, next) {
    const asciiPassword = req.body.password;
    const response = await userService.createAccount(req.body);
    if (response.error) {
        return res.json(response).status(400);
    } else {
        req.body = {username: req.body.email, password: asciiPassword};
        next();
    }
}, passport.authenticate('local'), function (req, res, next) {
    res.end();
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

router.get('/my-boards', passport.authenticate('cookie', {session: false}), async function (req, res) {
    const boards = await userService.findOwnedBoards(req.session.passport.user.email);
    res.json(boards);
});

router.get('/details', passport.authenticate('cookie', {session: false}), function (req, res) {
    res.json(req.session.passport.user);
});

router.delete('/delete', passport.authenticate('cookie'), function (req, res) {
});

module.exports = router;
