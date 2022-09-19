const {MongoClient} = require('mongodb');
require('dotenv').config();
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function insertOne(doc, collection) {
    const {ops} = await collection.insertOne(doc);
    return {...ops[0]};
}

function update(findQuery, updateQuery, collection) {
    try {
        return collection.updateOne(findQuery, updateQuery);
    } catch (error) {
        console.log("An error happened while updating db", error);
    }
}

async function findAndUpdate(query, updateQuery, collection, options, callback) {
    try {
        await collection.findOneAndUpdate(query, updateQuery, options, callback);
    } catch (error) {
        console.log("An error happened while updating db", error);
    }
}

function read(findQuery, collection) {
    return collection.findOne(findQuery);
}

function findAll(findQuery, collection) {
    try {
        return collection.find(findQuery);
    } catch (error) {
        console.log("An error happened while reading db", error);
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
    client,
    mongodb: {
        insertOne,
        update,
        findAndUpdate,
        client,
        read,
        run,
        findAll
    }
}
