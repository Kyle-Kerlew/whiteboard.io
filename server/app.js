const express = require('express');
const userController = require('./rest/controller/userController');
const whiteboardController = require('./rest/controller/whiteboardController');
const compression = require('compression');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const {client} = require('./persistence/connections/mongodb');
const passport = require('./configuration/passportConfig');
const cookieParser = require('cookie-parser')
const handleConnection = require("./socket/socketHandler");
const {mongodb} = require('./persistence/connections/mongodb');
const {Server} = require("socket.io");

const expressServer = express();

expressServer.use(express.json());
expressServer.use(express.urlencoded({extended: false}));
expressServer.use(cookieParser());
expressServer.use(compression());
expressServer.use(session({
    secret: 'test', //TODO: Change
    name: 'session-id',
    cookie: {
        //    secure: true todo:https
        maxAge: 30000
    },
    saveUninitialized: true,
    resave: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI || 'test',
        dbName: 'whiteboardio',
        collectionName: 'session',
        clientPromise: client
    })
}));

expressServer.use(passport.initialize());
expressServer.use(passport.session());
expressServer.use(cors());
expressServer.use('/user', userController);
expressServer.use('/whiteboard', whiteboardController);


const server = expressServer.listen(process.env.NODE_ENV !== 'production' ? 3001 : 8080, async (error) => {
    if (error) {
        console.log("Error starting express server", error);
        return;
    }
    await mongodb.run();

});
const socketIoServer = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET"]
    },
    serveClient: false,
});
socketIoServer.on('connection', handleConnection)
module.exports = server;