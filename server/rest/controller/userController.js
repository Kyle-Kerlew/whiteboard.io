const express = require('express');
const router = express.Router();
const {userService} = require('../../service/user/userService');
const {authenticationService} = require('../../service/authentication/authenticationService');

const jwt = require('jsonwebtoken');

router.post('/create-account', async function (req, res) {
    const response = await userService.createAccount(req.body);
    res.status(response && response.error ? 400 : 201).send(response);
});

router.post('/login', async function (req, res) {
    const response = await userService.loginUser(req.body);
    if (response.error) {
        return res.status(401).json({response});
    }
    res.json({response});
});

router.get('/whiteboards', authenticationService.verifyToken, async function (req, res) {
    res.json({message: "You're allowed to see this"});
});

router.delete('/delete', function (req, res) {
    //TODO: API security, authorized users only
});
module.exports = router;