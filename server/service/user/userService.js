const {BoardPersistence} = require("../../persistence/board/boardPersistence");
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
    user.role = 'user'; //TODO: Enum?
    const userEntity = await UserPersistence.createUser(collection, user);
    delete userEntity.password;
    return userEntity;
}

function findUserByEmail(email) {
    const collection = mongodb.client.db('whiteboardio').collection('user');
    return UserPersistence.findUserByEmail(collection, email);
}

function findOwnedBoards(user) {
    return BoardPersistence.findWhiteboardsByOwner(user);
}

function findUserByUserId(userId) {
    const collection = mongodb.client.db('whiteboardio').collection('user');
    return UserPersistence.findUserById(collection, userId);
}

function findUserBySession(sessionID) {
    const collection = mongodb.client.db('whiteboardio').collection('session');
    return UserPersistence.findUserBySessionID(collection, sessionID);
}

module.exports = {
    userService: {
        createAccount,
        findUserByEmail,
        findUserByUserId,
        findOwnedBoards,
        findUserBySession,
    }
}