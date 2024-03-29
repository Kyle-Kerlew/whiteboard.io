const {BoardPersistence} = require('../../persistence/board/boardPersistence');

async function findWhiteboardById(whiteboardId, user) {
    const result = await BoardPersistence.findWhiteboardById(whiteboardId);
    result.collaborators = result.collaborators.filter(collaborator => user?.email !== collaborator.email);
    return result;
}
function findStrokesByWhiteboardId(whiteboardId) {
    return BoardPersistence.findStrokesByWhiteboardId(whiteboardId);
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
    const whiteboard = {
        collaborators: user ? [user] : [],
        title: user ? user.firstName + '\'s Whiteboard' : 'Guest Whiteboard',
        owner: user?.email
    };
    return BoardPersistence.createWhiteboard(whiteboard);
}

function findWhiteboardByOwner(owner) {
    return BoardPersistence.findWhiteboardsByOwner(owner);
}
function setLastUpdated(whiteboardId) {
    return BoardPersistence.setLastUpdated(whiteboardId);
}

function updateDrawingData(whiteboardId, data) {
    return BoardPersistence.updateDrawingData(whiteboardId, data.subpath, data.strokeId);
}
function removeDrawingData(strokeId) {
    return BoardPersistence.removeDrawingData(strokeId);
}
function updateBoardTitle(whiteboardId, title) {
    return BoardPersistence.updateBoardTitle(whiteboardId, title);
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
        updateBoardTitle,
        removeCollaborator,
        addCollaborator,
        removeDrawingData,
        findWhiteboardByOwner,
        findStrokesByWhiteboardId,
        setLastUpdated
    }
}
