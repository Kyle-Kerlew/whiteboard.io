import {axios} from '../../configuration/axios';

function createAccount(request) {
    return axios.post('/user/create-account', request);
}

async function listWhiteboards() {
    //TODO: Pageable/sortaable/filterable?
    const {data} = await axios.get('/user/my-boards');
    return data;
}

function signIn(user) {
    return axios.post('/user/login', user);
}

function signOut() {
    return axios.get('/user/logout');
}

function createGuest(user) {
    return axios.post('/user/guest', user);
}

export const UserController = {
    createAccount,
    signIn,
    signOut,
    listWhiteboards,
    createGuest
};
