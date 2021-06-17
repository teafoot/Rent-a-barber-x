const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
const dbName = 'rent-a-barber-x-db';

var timestamp = new Date().getTime()

client.connect().then(client => {
    return client.db(dbName).listCollections().toArray()
}).then(result => {
    const collections = []
    result.forEach(obj => {
        const collection = obj.name
        collections.push(collection)
    })
    const db = client.db(dbName)
    exportCollection(db, collections) // has async logic
}).catch(err => {
    console.log(`error from "client.db(dbName).listCollections().toArray()": ${err}`)
})

const exportCollection = function (db, collections) {
    collections.forEach(collection => {
        return new Promise(function (resolve, reject) {
            const query = {};  // query criteria
            db.collection(collection).find(query).toArray(function (err, result) {
                if (err) reject(err);

                try {
                    !fs.existsSync(`${__dirname}/data/${timestamp}/`) && fs.mkdirSync(`${__dirname}/data/${timestamp}/`, { recursive: true }) // create timestamp folder
                    fs.writeFileSync(`${__dirname}/data/${timestamp}/${collection}.${timestamp}.json`, JSON.stringify(result))
                    resolve(`Done writing to file ${collection}.${timestamp}.json`)
                } catch (err) {
                    reject(`Error writing to file: ${err}`)
                }
            });
        }).then(result => {
            console.log(result)
            client.close() // close connection
        }).catch(err => {
            console.log(`error from "db.collection(collection).find(query).toArray()": ${err}`)
        })
    })
}