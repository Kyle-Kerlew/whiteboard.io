#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('./app');
const debug = require('debug')('collaborative-drawing-app:server');
const http = require('http');
const {Server} = require("socket.io");
const {mongodb} = require('./persistence/connections/mongodb');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
let drawingData = [];

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
    serveClient: false,

})

async function connectToMongo() {
    await mongodb.run();
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    io.on("connection", (socket => {
        setInterval(() => socket.emit("drawing-data-from-server", drawingData), 1000)
        socket.on("drawing-data", async (data) => {
            drawingData.push(data.data);
            const fillQuery = {whiteboardId: data.whiteboardId};
            const updateQuery = {$set: {data: drawingData}};
            await mongodb.update(fillQuery, updateQuery, drawingCollection);
        })
        socket.on("empty-page", async (whiteboardId) => {
            drawingData = [];
            const fillQuery = {whiteboardId: whiteboardId};
            const updateQuery = {$set: {data: []}};
            await mongodb.update(fillQuery, updateQuery, drawingCollection);
        })
        socket.on("create-whiteboard", async (data) => {
            try {
                await mongodb.insert(data, drawingCollection);
            } catch (err) {
                console.log("Something went wrong inserting data");
            }

        })
    }));

    io.on("connection", (socket => {
        setInterval(() => socket.emit("drawing-data-from-server", drawingData), 1000)
        socket.on("drawing-data", (data) => {
            drawingData.push(data.data);
        })
        socket.on("empty-page", () => {
            drawingData = [];
        })
    }));

}

void  connectToMongo()


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}