import {
  io,
} from 'socket.io-client';

export const Socket = io(
  process.env.REACT_APP_BACKEND_URL, {
    autoConnect: false,
    transports: [
      'websocket',
    ],
  },
);
