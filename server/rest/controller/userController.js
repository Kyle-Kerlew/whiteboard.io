const express = require('express');
const router = express.Router();
const {userService} = require('../../service/user/userService');
const {authenticationService} = require('../../service/authentication/authenticationService');
const passport = require('../../configuration/passportConfig');

const jwt = require('jsonwebtoken');

router.post('/create-account', async function (req, res) {
    const response = await userService.createAccount(req.body);
    res.status(response && response.error ? 400 : 201).send(response);
});

router.post('/login', passport.authenticate('local', {
}), async function (req, res) {
    const response = await userService.loginUser(req.body);
    res.send(response);
});

router.get('/whiteboards', async function (req, res) {
    res.json({message: "You're allowed to see this"});
});

router.delete('/delete', function (req, res) {
    //TODO: API security, authorized users only
});
module.exports = router;