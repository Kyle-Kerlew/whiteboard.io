async function createUser(collection, user) {
    try {
        return await collection.insertOne(user);
    } catch (e) {
        console.log("Error inserting data", e)
    }
}

async function findUserByEmail(collection, userId) {
    try {
        return await collection.findOne({email: userId});
    } catch (e) {
        console.log("Error finding user", e);
    }
}

module.exports = {
    UserPersistence: {
        createUser,
        findUser: findUserByEmail
    }
}