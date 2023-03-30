import {hashPassword} from "../../utils/hash";
import {v4} from "uuid";
import {client, connectPromise} from "../../persistence/connections/mongodb";
import {findWhiteboardsByOwner} from "../../persistence/board/boardPersistence";
import {createUser, findUserByEmail, findUserById, findUserBySessionID} from "../../persistence/user/userPersistence";


async function createAccount(user) {
    const collection = client.db('whiteboardio').collection('user');

    const existingUser = await findUserByEmail(collection, user.email);
    if (existingUser) {
        return {error: "A user already exists with this email address."};
    }
    user._id = v4();
    user.password = await hashPassword(user.password);
    user.role = 'user'; //TODO: Enum?
    const userEntity = await createUser(collection, user);
    delete userEntity.password;
    return userEntity;
}

async function getUserByEmail(email) {
    await connectPromise;
    const collection = client.db('whiteboardio').collection('user');
    return findUserByEmail(collection, email);
}

function findOwnedBoards(user) {
    return findWhiteboardsByOwner(user);
}

function findUserByUserId(userId) {
    const collection = client.db('whiteboardio').collection('user');
    return findUserById(collection, userId);
}

function findUserBySession(sessionID) {
    const collection = client.db('whiteboardio').collection('session');
    return findUserBySessionID(collection, sessionID);
}

export {
    createAccount,
    getUserByEmail,
    findUserByUserId,
    findOwnedBoards,
    findUserBySession,
};
