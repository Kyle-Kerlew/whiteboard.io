import * as BoardPersistence from "../../persistence/board/boardPersistence";

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

function updateDrawingData(whiteboardId, data) {
    return BoardPersistence.updateDrawingData(whiteboardId, data.subpath, data.strokeId);
}
function removeDrawingData(whiteboardId, strokeId) {
    return BoardPersistence.removeDrawingData(whiteboardId, strokeId);
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

export {
        findWhiteboardById,
        deleteDrawingData,
        createWhiteboard,
        updateDrawingData,
        updateBoardTitle,
        removeCollaborator,
        addCollaborator,
        removeDrawingData,
        findWhiteboardByOwner,
        findStrokesByWhiteboardId
};