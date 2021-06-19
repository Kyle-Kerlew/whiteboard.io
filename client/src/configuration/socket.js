import {io} from 'socket.io-client';

export const Socket = io(process.env.NODE_ENV !== 'production' ? 'localhost:3001' : process.env.REACT_APP_BASE_URL, {
    transports: ['websocket'],
    autoConnect: false
});
