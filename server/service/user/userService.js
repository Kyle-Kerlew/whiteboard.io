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
    delete userEntity.password;
    return userEntity;
}

async function loginUser(user) {
    console.log("What to do after user authorized?")
}

async function findUserByEmail(email) {
    const collection = mongodb.client.db('whiteboardio').collection('user');
    return UserPersistence.findUserByEmail(collection, email);
}

async function findUserByUserId(userId) {
    const collection = mongodb.client.db('whiteboardio').collection('user');
    return UserPersistence.findUserById(collection, userId);
}
async function findUserBySession(token) {
    const collection = mongodb.client.db('whiteboardio').collection('user');
    return UserPersistence.findUserById(collection, token);
}

module.exports = {
    userService: {
        createAccount,
        findUserByEmail,
        findUserByUserId,
        loginUser,
        findUserBySession,
    }
}