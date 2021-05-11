#!/usr/bin/env node
/**
 * Module dependencies.
 */

const app = require('./app');
const http = require('http');
const {Server} = require("socket.io");
const compression  = require('compression');
const {mongodb} = require('./persistence/connections/mongodb');
/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || 8080;
app.set('port', port);
app.use(compression());

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.REACT_APP_URL,
        methods: ["GET"]
    },
    serveClient: false,

})

//todo: look into using cache instead of a map
// const inMemoryDrawingData = new Map(); //track by whiteboard id
async function connectToMongo() {
    await mongodb.run();
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    io.on("connection", (socket => {
        socket.on("load-data", ({whiteboardId}) => {
            try {
                socket.join(whiteboardId); //join a room for everyone in a whiteboard
                //todo: make sure users can leave a room to
                const findQuery = {whiteboardId: whiteboardId};
                mongodb.read(findQuery, drawingCollection, (err, response) => {
                    if (err) {
                        console.log("something wrong");
                        return;
                    }
                    socket.emit("data-loaded", response.data);
                });

            } catch (err) {
                console.log("Something went wrong inserting data");
            }

        })
        socket.on("drawing-data", (data) => {
            const query = {whiteboardId: data.whiteboardId};
            const updateQuery = {$push: {data: data}};
            socket.to(data.whiteboardId).emit("drawing-data-from-server", data)
            try {
                mongodb.update(query, updateQuery, drawingCollection);
            } catch (err) {
                console.log("Something went wrong updating drawing data", err);
            }

        })
        socket.on("empty-page", (whiteboardId) => {
            const fillQuery = {whiteboardId: whiteboardId};
            const updateQuery = {$set: {data: []}};
            socket.to(whiteboardId).emit("empty-page-from-server")
            mongodb.update(fillQuery, updateQuery, drawingCollection);
        })
        socket.on("counterRequest", async () => socket.emit("counter", await mongodb.drawingBoardsCount(drawingCollection)));
        socket.on("create-whiteboard", async (data) => {
                try {
                    mongodb.insert(data, drawingCollection);
                    const response = await mongodb.drawingBoardsCount(drawingCollection);
                    socket.emit("counter", response)
                } catch (err) {
                    console.log("Something went wrong inserting data");
                }

            }
        )

    }));

}

void connectToMongo()


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);

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