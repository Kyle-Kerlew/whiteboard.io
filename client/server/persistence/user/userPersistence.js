import {insertOne, read} from "../connections/mongodb";


async function createUser(collection, user) {
    try {
        return await insertOne(user, collection);
    } catch (e) {
        console.log("Error inserting data", e);
    }
}

async function findUserByEmail(collection, email) {
    try {
        const user = await read({email: email}, collection);
        delete user.password;
        delete user._id;
        return user;
    } catch (e) {
        console.log("Error finding user", e);
    }
}

async function findUserById(collection, userId) {
    try {
        return await read({_id: userId}, collection);
    } catch (e) {
        console.log("Error finding user by id");
    }
}

async function findUserBySessionID(collection, sessionID) {
    try {
        return await read({_id: sessionID}, collection);
    } catch (e) {
        console.log("Error finding user by session");
    }
}

export {
    createUser,
    findUserByEmail,
    findUserById,
    findUserBySessionID,
};
