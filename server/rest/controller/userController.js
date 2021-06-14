const express = require('express');
const router = express.Router();
const {userService} = require('../../service/user/userService');

router.post('/create-account', async function (req, res) {
    //TODO: Api level validation on request

    const response = await userService.createAccount(req.body);
    res.status(response.error ? 400 : 201).send(response);
});

router.post('/login', function (req, res) {
    res.send('HELLO!');
});

router.delete('/delete', function (req, res) {
    //TODO: API security, authorized users only
});
module.exports = router;