const express = require('express');
const cookieParser = require('cookie-parser');
const userController = require('./rest/controller/userController');
const compression = require('compression');
const cors = require('cors');

const expressServer = express();

expressServer.use(express.json());
expressServer.use(express.urlencoded({extended: false}));
expressServer.use(cookieParser());
expressServer.use(compression());
expressServer.use(cors());
expressServer.use('/user', userController);


const server = expressServer.listen(process.env.NODE_ENV !== 'production' ? 3001 : 8080, (error) => {
    if (error) {
        console.log("Error starting express server", error);
        return;
    }
});

module.exports = server;