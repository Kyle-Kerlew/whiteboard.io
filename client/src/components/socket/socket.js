import {io} from 'socket.io-client';

export const Socket = io(process.env.BASE_URL);
