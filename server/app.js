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
        mongoUrl: process.env.DB_URI,
        dbName: 'whiteboardio',
        collectionName: 'session',
        clientPromise: client
    })
});

expressServer.use(sessionConfig);
expressServer.use(helmet());
expressServer.use(passport.initialize());
expressServer.use(passport.session());
expressServer.use(cors({origin: process.env.REACT_APP_URL, methods: "*", credentials: true}));

expressServer.use('/user', userController);
expressServer.use('/whiteboard', whiteboardController);


const server = expressServer.listen(process.env.PORT || 8080,'0.0.0.0', async (error) => {
    if (error) {
        console.log("Error starting express server", error);
        return;
    }
    await mongodb.run();
});
const socketIoServer = new Server(server, {
    serveClient: false,
});
socketIoServer.on('connection', handleConnection);
socketIoServer.use(sharedSession(sessionConfig));

module.exports = server;
