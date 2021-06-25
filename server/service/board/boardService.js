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

function createWhiteboard() {
    return BoardPersistence.createWhiteboard();
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
        addCollaborator
    }
}