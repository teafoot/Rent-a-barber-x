var MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
const dbName = 'rent-a-barber-x-db';
const assert = require("assert");

client.connect(function (err) {
    assert.equal(null, err);
    
    const db = client.db(dbName)
    db.dropDatabase(function (err, ok) {
        client.close()
        if (err) console.log(err)
        if (ok) console.log(`Database ${db.databaseName} deleted`)
    });
});