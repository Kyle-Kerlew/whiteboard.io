const express = require('express');
const userController = require('./rest/controller/userController');
const compression = require('compression');
const cors = require('cors');
const {authenticationService} = require("./service/authentication/authenticationService");

const expressServer = express();

expressServer.use(express.json());
expressServer.use(express.urlencoded({extended: false}));
// expressServer.set('trust proxy', 1); //trust first proxy TODO: wtf does this do?
expressServer.use(compression());
expressServer.use(cors());
expressServer.use('/user/whiteboards', authenticationService.authenticateUser);
expressServer.use('/user', userController);


const server = expressServer.listen(process.env.NODE_ENV !== 'production' ? 3001 : 8080, (error) => {
    if (error) {
        console.log("Error starting express server", error);
        return;
    }
});

module.exports = server;