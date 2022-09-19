import {
  io,
} from 'socket.io-client';

export const Socket = io(
  process.env.REACT_APP_BASE_URL, {
    autoConnect: false,
    transports: [
      'websocket',
    ],
  },
);
