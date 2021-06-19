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

function createWhiteboard(data) {
    return BoardPersistence.createWhiteboard(data);
}

function updateDrawingData(whiteboardId, data) {
    return BoardPersistence.updateDrawingData(whiteboardId, data);
}

module.exports = {
    BoardService: {
        findWhiteboardById,
        deleteDrawingData,
        createWhiteboard,
        countWhiteboards,
        updateDrawingData
    }
}