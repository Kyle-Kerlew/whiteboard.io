const jwt = require('jsonwebtoken');
const {userService} = require('../user/userService');

async function verifyToken(req, res, next) {
    try {
        console.log(req);
        const data = await jwt.verify(req.token, process.env.JWT_KEY || 'test');
        next();
    } catch (e) {
        console.log("Invalid", e);
        res.sendStatus(403);
    }
}

async function authenticateRequest(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }

}

async function createToken(userId) {
    try {
        const token = await jwt.sign({_id: userId}, process.env.JWT_KEY || "test", {expiresIn: '30s'});
        return token;
    } catch (e) {
        console.log("Something went wrong signing the jwt", e);
    }
}

module.exports = {
    authenticationService: {
        authenticateUser: authenticateRequest,
        createToken,
        verifyToken
    }
};