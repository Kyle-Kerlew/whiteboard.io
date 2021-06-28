const {v4} = require("uuid");
const {BoardPersistence} = require('../../persistence/board/boardPersistence');

function findWhiteboardById(whiteboardId) {
    return BoardPersistence.findWhiteboardById(whiteboardId);
}

function deleteDrawingData(whiteboardId) {
    return BoardPersistence.deleteWhiteboardDrawingData(whiteboardId);
}

function countWhiteboards() {
    return BoardPersistence.countWhiteboards();
}

function createWhiteboard(user) {
    if (!user) {
        user = null;
    }
    const whiteboard = {};
    whiteboard.collaborators = [];
    whiteboard.title = user ? user + '\'s Whiteboard' : 'Guest Whiteboard';
    whiteboard.owner = user;
    return BoardPersistence.createWhiteboard(whiteboard);
}

function findWhiteboardByOwner(owner) {
    return BoardPersistence.findWhiteboardsByOwner(owner);
}

function updateDrawingData(whiteboardId, data) {
    return BoardPersistence.updateDrawingData(whiteboardId, data);
}

function addCollaborator(whiteboardId, collaborator) {
    return BoardPersistence.addCollaborator(whiteboardId, collaborator);
}

function removeCollaborator(whiteboardId, collaborator) {
    return BoardPersistence.removeCollaborator(whiteboardId, collaborator);
}

module.exports = {
    BoardService: {
        findWhiteboardById,
        deleteDrawingData,
        createWhiteboard,
        countWhiteboards,
        updateDrawingData,
        removeCollaborator,
        addCollaborator,
        findWhiteboardByOwner
    }
}