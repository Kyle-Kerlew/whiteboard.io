import {ObjectId} from "mongodb";
import {client, connectPromise, deleteAll, deleteOne, findAll, insertOne, read, update} from "../connections/mongodb";
import _ from 'lodash';

async function deleteWhiteboardDrawingData(whiteboardId) {
    await connectPromise;
    const drawingCollection = client.db('whiteboardio').collection('drawingData');

    const searchQuery = {whiteboardId: whiteboardId};
    await deleteAll(searchQuery, drawingCollection);
}

async function updateDrawingData(whiteboardId, subpath, strokeId) {
    await connectPromise;
    const drawingCollection = client.db('whiteboardio').collection('drawingData');

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
    await update(query, updateQuery, drawingCollection, {upsert: true});

}

async function removeDrawingData(whiteboardId, strokeId) {
    await connectPromise;
    const drawingCollection = client.db('whiteboardio').collection('drawingData');
    console.log('remove stroke', strokeId)
    const query = {_id: strokeId};
    await deleteOne(query, drawingCollection);
}

async function updateBoardTitle(whiteboardId, title) {
    await connectPromise;
    const drawingCollection = client.db('whiteboardio').collection('boardData');

    const query = {_id: new ObjectId(whiteboardId)};
    const updateQuery = {$set: {title, lastUpdated: "$$NOW"}};
    await update(query, updateQuery, drawingCollection);
}

async function createWhiteboard(whiteboard) {
    await connectPromise;
    const drawingCollection = client.db('whiteboardio').collection('boardData');
    //todo: align this date with mongodb $$now so there's no discrepancy between format on creation vs on update
    const date = new Date();
    return insertOne({...whiteboard, lastUpdated: date.toISOString()}, drawingCollection);
}

async function findWhiteboardsByOwner(owner) {
    await connectPromise;
    const drawingCollection = client.db('whiteboardio').collection('boardData');
    const findQuery = {owner: owner};
    const result = await findAll(findQuery, drawingCollection).toArray();
    return result.map(item => {
        delete item.data;
        return item;
    });
}

async function findWhiteboardById(whiteboardId) {
    let response = {};
    await connectPromise;
    const drawingCollection = client.db('whiteboardio').collection('drawingData');
    const boardCollection = client.db('whiteboardio').collection('boardData');
    const findQuery = {_id: new ObjectId(whiteboardId)};
    const drawingDataQuery = {whiteboardId: whiteboardId};
    const drawingDataCursor = findAll(drawingDataQuery, drawingCollection);
    response = await read(findQuery, boardCollection);
    response.strokes = await drawingDataCursor.toArray()
    return response;
}

async function findStrokesByWhiteboardId(whiteboardId) {
    await connectPromise;
    const drawingCollection = client.db('whiteboardio').collection('drawingData');
    const findQuery = {whiteboardId: whiteboardId};
    return findAll(findQuery, drawingCollection);
}

async function removeCollaborator(whiteboardId, collaborator) {
    await connectPromise;
    const drawingCollection = client.db('whiteboardio').collection('boardData');
    const findQuery = {_id: new ObjectId(whiteboardId)};
    const removeQuery = {$pull: {collaborators: collaborator}};
    return update(findQuery, removeQuery, drawingCollection);

}

function addCollaborator(whiteboardId, collaborator) {
    const drawingCollection = client.db('whiteboardio').collection('boardData');
    const findQuery = {_id: new ObjectId(whiteboardId)};
    const updateQuery = {$push: {collaborators: collaborator}};
    return update(findQuery, updateQuery, drawingCollection);
}

export {
        findWhiteboardById,
        deleteWhiteboardDrawingData,
        removeDrawingData,
        updateDrawingData,
        updateBoardTitle,
        createWhiteboard,
        removeCollaborator,
        addCollaborator,
        findWhiteboardsByOwner,
        findStrokesByWhiteboardId
};
