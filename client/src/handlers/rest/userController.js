import {axios} from '../../configuration/axios';

async function createAccount(request) {
    try {
        await axios.post('/user/create-account', request);
    } catch (e) {
        throw e;
    }
}

async function listWhiteboards() {
    //TODO: Pageable/sortaable/filterable?
    try {
        await axios.get('/user/my-boards');
    } catch (e) {
        throw e;
    }
}

async function signIn(user) {
    try {
        await axios.post('/user/login', user);
    } catch (e) {
        throw e;
    }

}

async function signOut() {
    try {
        await axios.get('/user/logout');
    } catch (e) {
        throw e;
    }

}

export const UserController = {
    createAccount,
    signIn,
    signOut,
    listWhiteboards
};
