const {Server: SocketIOServer} = require("socket.io");
const {server: httpServer} = require('./app');

function listen() {
    //todo: at what point is the drawingArray too large to keep updating in memory
    let drawingData = [];
    const client = mongodb.client;
    const db = client.db;
    const io = new SocketIOServer(httpServer, {
        // cors: {
        //     origin: "http://localhost:3000",
        //     methods: ["*"]
        // },
        serveClient: false,

    })



}

module.exports = {
    server: {
        listen,
    }
};