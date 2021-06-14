const {mongodb} = require("../../persistence/connections/mongodb");
const {UserPersistence} = require('../../persistence/user/userPersistence');

async function createAccount(user) {
    const collection = mongodb.client.db('whiteboardio').collection('user');
    const existingUser = await UserPersistence.findUser(collection, user.email);
    if (existingUser) {
        return {error: "A user already exists with this email address"};
    }
    return (await UserPersistence.createUser(collection, user)).ops;
}

module.exports = {
    userService: {
        createAccount
    }
}