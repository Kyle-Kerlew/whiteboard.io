const {doesPasswordMatch} = require("../../utils/hash");
const {authenticationService} = require("../authentication/authenticationService");
const {hashPassword} = require("../../utils/hash");
const {v4} = require('uuid');
const {mongodb} = require("../../persistence/connections/mongodb");
const {UserPersistence} = require('../../persistence/user/userPersistence');

async function createAccount(user) {
    const collection = mongodb.client.db('whiteboardio').collection('user');

    const existingUser = await UserPersistence.findUserByEmail(collection, user.email);
    if (existingUser) {
        return {error: "A user already exists with this email address."};
    }
    user._id = v4();
    user.password = await hashPassword(user.password);
    const userEntity = await UserPersistence.createUser(collection, user);
    userEntity.token = authenticationService.createToken(user._id);
    return userEntity;
}

async function loginUser(user) {
    const userEntity = await findUserByEmail(user.email);
    if (!userEntity) {
        return {error: "Invalid credentials."}
    }
    const validCredentials = await doesPasswordMatch(user.password, userEntity.password);
    if (!validCredentials) {
        return {error: "Invalid credentials."}
    }
    const authenticatedUser = userEntity;
    authenticatedUser.token = await authenticationService.createToken(userEntity._id);
    return authenticatedUser;
}

async function findUserByEmail(email) {
    const collection = mongodb.client.db('whiteboardio').collection('user');
    return UserPersistence.findUserByEmail(collection, email);
}

async function findUserByUserId(userId) {
    const collection = mongodb.client.db('whiteboardio').collection('user');
    return UserPersistence.findUserById(collection, userId);
}

module.exports = {
    userService: {
        createAccount,
        findUserByEmail,
        findUserByUserId,
        loginUser
    }
}