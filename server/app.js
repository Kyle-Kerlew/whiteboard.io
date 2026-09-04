const express = require('express');
const userController = require('./rest/controller/userController');
const whiteboardController = require('./rest/controller/whiteboardController');
const compression = require('compression');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const {clientPromise} = require('./persistence/connections/mongodb');
const passport = require('./configuration/passportConfig');
const cookieParser = require('cookie-parser')
const handleConnection = require("./socket/socketHandler");
const {mongodb} = require('./persistence/connections/mongodb');
const {Server} = require("socket.io");
const sharedSession = require('express-socket.io-session');
const helmet = require("helmet");
const expressServer = express();

expressServer.set('trust proxy', 1) // trust first proxy
expressServer.use(express.json());
expressServer.use(express.urlencoded({extended: false}));
expressServer.use(cookieParser());
expressServer.use(compression());
const sessionConfig = session({
    secret: process.env.SESSION_SECRET, //TODO: Change
    name: 'session-id',
    cookie: {
        maxAge: 3600000*24, //24 Hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : undefined,
        secure: process.env.NODE_ENV === 'production'
    },
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        dbName: 'whiteboardio',
        collectionName: 'session',
        clientPromise
    })
});

expressServer.use(sessionConfig);
expressServer.use(helmet());
expressServer.use(passport.initialize());
expressServer.use(passport.session());
expressServer.use(cors({origin: process.env.REACT_APP_BASE_URL, methods: "*", credentials: true}));

expressServer.use('/user', userController);
expressServer.use('/whiteboard', whiteboardController);


async function startServer() {
    await mongodb.run();

    const server = expressServer.listen(process.env.PORT || 8080, '0.0.0.0', (error) => {
        if (error) {
            console.log("Error starting express server", error);
        }
    });
    const socketIoServer = new Server(server, {
        serveClient: false,
    });
    socketIoServer.on('connection', handleConnection);
    socketIoServer.use(sharedSession(sessionConfig));

    return server;
}

module.exports = startServer();
