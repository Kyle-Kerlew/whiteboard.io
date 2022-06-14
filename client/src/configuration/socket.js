import {
  io,
} from 'socket.io-client';

export const Socket = io(process.env.NODE_ENV !== 'production' ?
  'https://whiteboard-io-server-demo.herokuapp.com/' :
  process.env.REACT_APP_BASE_URL, {
  autoConnect: false,
  transports: [
    'websocket',
  ],
});
