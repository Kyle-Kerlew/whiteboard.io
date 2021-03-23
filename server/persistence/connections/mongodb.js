const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://***REMOVED***@cluster0.bwkf5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function insert(client, db, doc) {
    return db.collection('DrawingData').insertOne(doc).catch(err => console.log(err)).finally(() => client.close);
}

async function update(fillQuery, updateQuery, client, db) {
    return db.collection('DrawingData').updateOne(fillQuery, updateQuery).catch(err => console.log(err)).finally(() => client.close);
}

client.connect(err => {
    if (err) throw err;
    console.log('connected');

})
module.exports = {
    mongodb: {
        insert,
        update,
        client
    }
}