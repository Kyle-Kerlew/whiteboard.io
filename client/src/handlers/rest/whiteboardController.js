import {axios} from '../../configuration/axios';

function createWhiteboard() {
    try {
        return axios.post('/whiteboard/create');
    } catch (e) {
        throw e;
    }
}

function countWhiteboards() {
    try {
        return axios.get('/whiteboard/count');
    } catch (e) {
        throw e;
    }
}

function getWhiteboardById(whiteboardId) {
    try {
        return axios.get('/whiteboard/read/' + whiteboardId);
    } catch (e) {
        throw e;
    }
}

export const WhiteboardController = {
    createWhiteboard,
    countWhiteboards,
    getWhiteboardById
};
