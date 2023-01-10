import {axios} from '../../configuration/axios';

async function createWhiteboard() {
    const {data} = await axios.post('/api/whiteboard/create');
    return data;
}

async function getWhiteboardById(whiteboardId) {
    const {data} = await axios.get('/api/whiteboard/read/' + whiteboardId);
    return data;
}

export const WhiteboardController = {
    createWhiteboard,
    getWhiteboardById
};
