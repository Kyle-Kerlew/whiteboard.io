import { Server } from 'socket.io'
import handleConnection from "../../server/socket/socketHandler";

const Socket = (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io
        io.on('connection', socket => {
            handleConnection(socket);
        })

    }
    res.end()
}

export default Socket
