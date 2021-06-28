import {axios} from '../../configuration/axios';

async function createWhiteboard() {
    const {data} = await axios.post('/whiteboard/create');
    return data;
}

function countWhiteboards() {
    return axios.get('/whiteboard/count');
}

async function getWhiteboardById(whiteboardId) {
    const {data} = await axios.get('/whiteboard/read/' + whiteboardId);
    return data;
}

export const WhiteboardController = {
    createWhiteboard,
    countWhiteboards,
    getWhiteboardById
};
