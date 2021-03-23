const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://kerlks:hhaXCgdDWHioKdEE@cluster0.bwkf5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function insert(doc, collection) {
    console.log("Inserting data....")
    console.log("Value of collection " + collection)
    try {
        await collection.insertOne(doc);
    } catch (e) {
        console.log("Error inserting data", e)
    } finally {
        await client.close()
    }
}

async function update(fillQuery, updateQuery, collection) {
    try {
        await collection.updateOne(fillQuery, updateQuery);
    } catch (error) {
        console.log("An error happened while updating db", error);
    } finally {
        await client.close();
    }
}

async function run() {
    try {
        await client.connect();
    } catch (error) {
        console.log("Problem connecting to mongo db", error);

    } finally {

    }
}


module.exports = {
    mongodb: {
        insert,
        update,
        client,
        run
    }
}