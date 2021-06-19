const {mongodb} = require("../connections/mongodb");
const {v4} = require('uuid');

async function deleteWhiteboardDrawingData(whiteboardId) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');

    const fillQuery = {_id: whiteboardId};
    const updateQuery = {$set: {data: []}};
    await mongodb.update(fillQuery, updateQuery, drawingCollection);
}

async function updateDrawingData(whiteboardId, data) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');

    const query = {_id: whiteboardId};
    const updateQuery = {$push: {data: data}};
    await mongodb.update(query, updateQuery, drawingCollection);
}

async function createWhiteboard(data = {}) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    data._id = v4();
    await mongodb.insert(data, drawingCollection);
    return data;
    // if (data && data.user) {
    //     UserPersistence.findAndUpdate()
    // }
}

function findWhiteboardById(whiteboardId) {
    const drawingCollection = mongodb.client.db('whiteboardio').collection('drawingData');
    const findQuery = {_id: whiteboardId};
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

module.exports = {
    BoardPersistence: {
        findWhiteboardById,
        deleteWhiteboardDrawingData,
        updateDrawingData,
        countWhiteboards,
        createWhiteboard
    }
}