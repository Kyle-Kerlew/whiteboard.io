const {MongoClient} = require('mongodb');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const uri = process.env.DB_URI
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function insert(doc, collection) {
    try {
        await collection.insertOne(doc);
    } catch (e) {
        console.log("Error inserting data", e)
    }
}

async function update(fillQuery, updateQuery, collection) {
    try {
        await collection.updateOne(fillQuery, updateQuery);
    } catch (error) {
        console.log("An error happened while updating db", error);
    }
}

async function drawingBoardsCount(collection) {
    try {
        return await collection.countDocuments({});
    } catch (error) {
        console.log("An error happened while counting entries in db", error);
    }
}

async function read(findQuery, collection, callback) {
    try {
        return await collection.findOne(findQuery, callback);
    } catch (error) {
        console.log("An error happened while updating db", error);
    }
}

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected")
    } catch (error) {
        console.log("Problem connecting to mongo db", error);
    }
}


module.exports = {
    mongodb: {
        insert,
        update,
        drawingBoardsCount,
        read,
        client,
        run
    }
}