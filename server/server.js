#!/usr/bin/env node

const server = require('./app');
const {Server} = require("socket.io");
const {mongodb} = require('./persistence/connections/mongodb');
/**
 * Get port from environment and store in Express.
 */
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : process.env.REACT_APP_URL,
        methods: ["GET"]
    },
    serveClient: false,
});

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
            socket.to(data.whiteboardId).emit("drawing-data-from-server", data);
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

void connectToMongo();
