async function createUser(collection, user) {
    try {
        return await collection.insertOne(user);
    } catch (e) {
        console.log("Error inserting data", e);
        throw "Error creating user";
    }
}

async function findUserByEmail(collection, email) {
    try {
        return await collection.findOne({email});
    } catch (e) {
        console.log("Error finding user", e);
    }
}

async function findUserById(collection, userId) {
    try {
        return await collection.findOne({_id: userId});
    } catch (e) {
        console.log("Error finding user by id");
    }
}

module.exports = {
    UserPersistence: {
        createUser,
        findUserByEmail,
        findUserById
    }
}