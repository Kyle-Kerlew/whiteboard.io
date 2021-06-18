const express = require('express');
const userController = require('./rest/controller/userController');
const compression = require('compression');
const cors = require('cors');
const {authenticationService} = require("./service/authentication/authenticationService");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const {client} = require('./persistence/connections/mongodb');
const passport = require('./configuration/passportConfig');

const expressServer = express();

expressServer.use(express.json());
expressServer.use(express.urlencoded({extended: false}));
expressServer.use(compression());
expressServer.use(session({
    secret: 'test', //TODO: Change
    name: 'session-id',
    cookie: {
        httpOnly: true, //prevent use of document.cookie object in client: limits ability to do CSRF attacks
        //    secure: true todo:https
        maxAge: 30000
    },
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        clientPromise: client
    })//Attempting to reuse existing mongo connection
}));

expressServer.use(passport.initialize({}));
expressServer.use(passport.session({}));
expressServer.use(cors());
expressServer.use('/user', userController);


const server = expressServer.listen(process.env.NODE_ENV !== 'production' ? 3001 : 8080, (error) => {
    if (error) {
        console.log("Error starting express server", error);
        return;
    }
});

module.exports = server;