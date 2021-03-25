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
    } finally {
        // await client.close()
    }
}

async function update(fillQuery, updateQuery, collection) {
    try {
        await collection.updateOne(fillQuery, updateQuery);
    } catch (error) {
        console.log("An error happened while updating db", error);
    } finally {
        // await client.close();
    }
}

async function read(findQuery, collection, callback) {
    try {
        return await collection.findOne(findQuery, callback);
    } catch (error) {
        console.log("An error happened while updating db", error);
    } finally {
        // await client.close();
    }
}

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected")
    } catch (error) {
        console.log("Problem connecting to mongo db", error);

    } finally {
        // await client.close();
        // console.log("Successfully closed connection")
    }
}


module.exports = {
    mongodb: {
        insert,
        update,
        read,
        client,
        run
    }
}