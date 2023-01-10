import {MongoClient} from "mongodb";

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function insertOne(doc, collection) {
    const {ops} = await collection.insertOne(doc);
    console.log(ops)
    return {...ops[0]};
}

function update(findQuery, updateQuery, collection, options) {
    try {
        return collection.updateOne(findQuery, updateQuery, options);
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

function deleteOne(findQuery, collection) {
    return collection.deleteOne(findQuery);
}

function deleteAll(findQuery, collection) {
    return collection.deleteMany(findQuery);
}

function findAll(findQuery, collection) {
    try {
        return collection.find(findQuery);
    } catch (error) {
        console.log("An error happened while reading db", error);
    }
}


const connectPromise = client.connect()


export {
    client,
    insertOne,
    update,
    deleteAll,
    findAndUpdate,
    read,
    connectPromise,
    findAll,
    deleteOne
};
