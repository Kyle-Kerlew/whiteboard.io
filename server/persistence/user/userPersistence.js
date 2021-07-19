const {mongodb} = require("../connections/mongodb");

async function createUser(collection, user) {
    try {
        return await mongodb.insertOne(user, collection);
    } catch (e) {
        console.log("Error inserting data", e);
    }
}

async function findUserByEmail(collection, email) {
    try {
        return await mongodb.read({email: email}, collection);
    } catch (e) {
        console.log("Error finding user", e);
    }
}

async function findUserById(collection, userId) {
    try {
        return await mongodb.read({_id: userId}, collection);
    } catch (e) {
        console.log("Error finding user by id");
    }
}

async function findUserBySessionID(collection, sessionID) {
    try {
        return await mongodb.read({_id: sessionID}, collection);
    } catch (e) {
        console.log("Error finding user by session");
    }
}

module.exports = {
    UserPersistence: {
        createUser,
        findUserByEmail,
        findUserById,
        findUserBySessionID,
    }
}