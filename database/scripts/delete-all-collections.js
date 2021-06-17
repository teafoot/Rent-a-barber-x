var MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
const dbName = 'rent-a-barber-x-db';

client.connect().then(client => {
    return client.db(dbName).listCollections().toArray()
}).then(result => {
    const collections = []
    result.forEach(obj => {
        const collection = obj.name
        collections.push(collection)
    })
    const db = client.db(dbName)
    dropCollection(db, collections) // has async logic
}).catch(err => {
    console.log(`error from "client.db(dbName).listCollections().toArray()": ${err}`)
})

const dropCollection = function (db, collections) {
    collections.forEach(collection => {
        return new Promise(function (resolve, reject) {
            db.collection(collection).drop(function (err, ok) {
                if (err) reject(`${collection}: ${err.codeName}`);
                if (ok) resolve(`${collection}: deleted`);
            })
        }).then(result => {
            console.log(result)
            client.close() // close connection
        }).catch(err => {
            console.log(`error from "db.collection(collection).drop()": ${err}`)
        })
    })
}