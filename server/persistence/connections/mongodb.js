const {MongoClient} = require('mongodb');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

function insert(doc, collection) {
    return collection.insertOne(doc);
}

async function update(fillQuery, updateQuery, collection) {
    try {
        await collection.updateOne(fillQuery, updateQuery);
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
    try {
        return collection.findOne(findQuery);
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
    mongodb: {
        insert,
        update,
        findAndUpdate,
        read,
        client,
        run
    }
}