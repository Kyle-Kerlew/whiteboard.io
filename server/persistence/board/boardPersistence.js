const {mongodb} = require("../connections/mongodb");
const {ObjectID} = require("mongodb");

async function deleteWhiteboardDrawingData(whiteboardId) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');

    const fillQuery = {_id: new ObjectID(whiteboardId)};
    const updateQuery = {$set: {data: []}};
    await mongodb.update(fillQuery, updateQuery, drawingCollection);
}

async function updateDrawingData(whiteboardId, data) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');

    const query = {_id: new ObjectID(whiteboardId)};
    const updateQuery = {$push: {data: data}};
    await mongodb.update(query, updateQuery, drawingCollection);
}

async function removeDrawingData(whiteboardId, data) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');

    const query = {_id: new ObjectID(whiteboardId)};
    const updateQuery = {$pullAll: {data}};
    await mongodb.update(query, updateQuery, drawingCollection);
}
async function updateBoardTitle(whiteboardId, title) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');

    const query = {_id: new ObjectID(whiteboardId)};
    const updateQuery = {$set: {title}};
    await mongodb.update(query, updateQuery, drawingCollection);
}

function createWhiteboard(whiteboard) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    return mongodb.insertOne(whiteboard, drawingCollection);
}

async function findWhiteboardsByOwner(owner) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    const findQuery = {owner: owner};
    return mongodb.findAll(findQuery, drawingCollection).toArray();
}

async function findWhiteboardById(whiteboardId) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    const findQuery = {_id: new ObjectID(whiteboardId)};
    return mongodb.read(findQuery, drawingCollection);
}

function countWhiteboards() {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    try {
        return drawingCollection.countDocuments();
    } catch (error) {
        console.log("An error happened while counting entries in db", error);
    }
}

function removeCollaborator(whiteboardId, collaborator) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    const findQuery = {_id: new ObjectID(whiteboardId)};
    const removeQuery = {$pull: {collaborators: collaborator}};
    return mongodb.update(findQuery, removeQuery, drawingCollection);

}

function addCollaborator(whiteboardId, collaborator) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    const findQuery = {_id: new ObjectID(whiteboardId)};
    const updateQuery = {$push: {collaborators: collaborator}};
    return mongodb.update(findQuery, updateQuery, drawingCollection);
}

module.exports = {
    BoardPersistence: {
        findWhiteboardById,
        deleteWhiteboardDrawingData,
        removeDrawingData,
        updateDrawingData,
        updateBoardTitle,
        countWhiteboards,
        createWhiteboard,
        removeCollaborator,
        addCollaborator,
        findWhiteboardsByOwner
    }
}
