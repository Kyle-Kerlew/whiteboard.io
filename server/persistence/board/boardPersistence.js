const {mongodb} = require("../connections/mongodb");
const {ObjectID} = require("mongodb");

async function deleteWhiteboardDrawingData(whiteboardId) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');

    const searchQuery = {whiteboardId: whiteboardId};
    await mongodb.deleteAll(searchQuery, drawingCollection);
}

async function updateDrawingData(whiteboardId, subpath, strokeId) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');

    const query = {
        _id: strokeId
    };

    const updateQuery = {
        $set: {
            whiteboardId: whiteboardId
        },
        $push: {
            subpath: subpath
        }
    }
    await mongodb.update(query, updateQuery, drawingCollection, {upsert: true});

}

async function removeDrawingData(whiteboardId, strokeId) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    console.log('remove stroke', strokeId)
    const query = {_id: strokeId};
    await mongodb.deleteOne(query, drawingCollection);
}

async function updateBoardTitle(whiteboardId, title) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('boardData');

    const query = {_id: new ObjectID(whiteboardId)};
    const updateQuery = {$set: {title, lastUpdated: "$$NOW"}};
    await mongodb.update(query, updateQuery, drawingCollection);
}

function createWhiteboard(whiteboard) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('boardData');
    //todo: align this date with mongodb $$now so there's no discrepancy between format on creation vs on update
    const date = new Date();
    return mongodb.insertOne({...whiteboard, lastUpdated: date.toISOString()}, drawingCollection);
}

async function findWhiteboardsByOwner(owner) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('boardData');
    const findQuery = {owner: owner};
    const result = await mongodb.findAll(findQuery, drawingCollection).toArray();
    return result.map(item => {
        delete item.data;
        return item;
    });
}

async function findWhiteboardById(whiteboardId) {
    let response = {};
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    const boardCollection = mongodb.client.db('whiteboardio').collection('boardData');
    const findQuery = {_id: new ObjectID(whiteboardId)};
    const drawingDataQuery = {whiteboardId: whiteboardId};
    const drawingDataCursor = mongodb.findAll(drawingDataQuery, drawingCollection);
    response = await mongodb.read(findQuery, boardCollection);
    response.strokes = await drawingDataCursor.toArray()
    return response;
}

async function findStrokesByWhiteboardId(whiteboardId) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    const findQuery = {whiteboardId: whiteboardId};
    return mongodb.findAll(findQuery, drawingCollection);
}

function countWhiteboards() {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('boardData');
    try {
        return drawingCollection.countDocuments();
    } catch (error) {
        console.log("An error happened while counting entries in db", error);
    }
}

function removeCollaborator(whiteboardId, collaborator) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('boardData');
    const findQuery = {_id: new ObjectID(whiteboardId)};
    const removeQuery = {$pull: {collaborators: collaborator}};
    return mongodb.update(findQuery, removeQuery, drawingCollection);

}

function addCollaborator(whiteboardId, collaborator) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('boardData');
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
        findWhiteboardsByOwner,
        findStrokesByWhiteboardId
    }
}
