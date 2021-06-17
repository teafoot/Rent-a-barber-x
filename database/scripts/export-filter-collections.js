const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
const dbName = 'rent-a-barber-x-db';
const assert = require("assert");

var timestamp = new Date().getTime();

client.connect(function (err) {
    assert.equal(null, err);
    const db = client.db(dbName);

    let collections = [
        // 'barbershops',
        'users'
    ]
    exportCollection(db, collections)
})

const exportCollection = function (db, collections) {
    collections.forEach(collection => {
        const query = {};  // query criteria
        db.collection(collection).find(query).toArray(function (err, result) {
            if (err) throw err;
            client.close(); // close connection

            try {
                !fs.existsSync(`${__dirname}/data/${timestamp}/`) && fs.mkdirSync(`${__dirname}/data/${timestamp}/`, { recursive: true }) // create timestamp folder
                fs.writeFileSync(`${__dirname}/data/${timestamp}/${collection}.${timestamp}.json`, JSON.stringify(result))
                console.log(`Done writing to file ${collection}.${timestamp}.json`)
            } catch (err) {
                console.log('Error writing to file', err)
            }
        });
    });
};