var MongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URL
const dbName = process.env.DB_NAME
const client = new MongoClient(url, { useUnifiedTopology: true });
// const url = 'mongodb://localhost:27017'
// const dbName = 'rent-a-barber-x-db';
const assert = require("assert");

client.connect(function (err) {
    assert.equal(null, err);
    const db = client.db(dbName)

    let collections = [// change this value
        // 'users',
        // 'barbershops', 
        'messages'
    ] 
    dropCollection(db, collections)
});

const dropCollection = function (db, collections) {
    collections.forEach(collection => {
        db.collection(collection).drop(function (err, ok) {
            client.close();
            if (err) console.log(`${collection}: ${err.codeName}`);
            if (ok) console.log(`${collection} collection deleted`);
        });
    });
}