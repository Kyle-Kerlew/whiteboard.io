import {
  axios,
} from '../../configuration/axios';

function createAccount (request) {
  return axios.post('/api/user/create-account', request);
}

async function listWhiteboards () {
  // TODO: Pageable/sortaable/filterable?
  const {
    data,
  } = await axios.get('/api/user/my-boards');
  return data;
}

function signIn (user) {
  return axios.post('/api/user/login', user);
}

function signOut () {
  return axios.get('/api/user/logout');
}

function createGuest (user) {
  return axios.post('/api/user/guest', user);
}

async function getUserDetailsByCookie () {
  const {
    data,
  } = await axios.get('/api/user/details');
  return data;
}

export const UserController = {
  createAccount,
  createGuest,
  getUserDetailsByCookie,
  listWhiteboards,
  signIn,
  signOut,
};
