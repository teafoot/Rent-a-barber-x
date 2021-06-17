var MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
const dbName = 'rent-a-barber-x-db';
const assert = require("assert");

client.connect(function (err) {
    assert.equal(null, err);
    const db = client.db(dbName)

    let collections = [// change this value
        'barbershops', 
        // 'users'
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