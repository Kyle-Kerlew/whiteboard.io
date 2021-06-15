import {axios} from '../../configuration/axios';


async function createAccount(request) {
    try {
        await axios.post('/user/create-account', request);
    } catch (e) {
        throw e;
    }
}

async function signIn(values) {
    try {
        await axios.post('/login', values);
    } catch (e) {
        throw e;
    }

}

export const UserHandler = {
    createAccount,
    signIn
};
