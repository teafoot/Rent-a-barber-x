const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
const dbName = 'rent-a-barber-x-db';
const assert = require("assert");

const FOLDER_NAME = '1623789580137' // Change this value to a different timestamp dir

client.connect(function (err) {
    const db = client.db(dbName);

    const TARGET_DIR = `${__dirname}/data/${FOLDER_NAME}/` // timestamped directory under data folder
    fs.readdirSync(TARGET_DIR).forEach(fileName => {// for every file inside the directory, insert its data to its appropriate collection
        const collection = fileName.split('.')[0]
        const fileData = fs.readFileSync(`${TARGET_DIR}${fileName}`)
        const docs = JSON.parse(fileData.toString())

        db.collection(collection).insertMany(docs, function (err, ok) {
            client.close();
            if (err) {
                console.log(err) // Drop the database first!
            }
            if (ok) console.log(`Inserted to ${collection} - ${ok.insertedCount} documents`)
        })
    })
})