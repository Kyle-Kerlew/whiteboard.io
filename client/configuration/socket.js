import {
    io,
} from 'socket.io-client';

const Socket = {};
Socket.instance = undefined;
Socket.connect = async () => {
    await fetch('/api/socket');
    return io(
        process.env.REACT_APP_BASE_URL, {
            autoConnect: false,
            transports: [
                'websocket',
            ],
        })
}
Socket.getInstance = async () => {
    if (!Socket.instance) {
        Socket.instance = await Socket.connect();
        return Socket.instance;
    }
    return Socket.instance;
}

export default Socket;
