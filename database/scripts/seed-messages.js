const MongoClient = require("mongodb").MongoClient;
// const url = "mongodb://localhost:27017";
const url = process.env.DB_URL
// const dbName = "rent-a-barber-x-db"
const dbName = process.env.DB_NAME
const faker = require("faker");
const assert = require("assert");

MongoClient.connect(url, async function (err, client) {
    assert.equal(null, err);
    const db = client.db(dbName)

    await seedTestMessages(db)

    client.close();
})

async function seedTestMessages(db) {
    const usersCollection = db.collection("users")
    const contactsCollection = db.collection("contacts")
    const messagesCollection = db.collection("messages")

    let now = new Date()
    var dateOffset = (24 * 60 * 60 * 1000) * 30; //30 days
    now.setTime(now.getTime() - dateOffset);

    const messagesCount = 40;
    for (let i = 0; i < messagesCount; i++) {
        // const randomBoolean = Math.random() < 0.5;
        // if (randomBoolean) {
            // sender_email = 'test0@test.com'
            // receiver_email = 'test1@test.com'
        // } else {
            // sender_email = 'test1@test.com'
            // receiver_email = 'test0@test.com'
        // }
        
        let emails = ['test0@test.com', 'test1@test.com', 'test2@test.com']
        //
        let randomIndex = Math.floor(Math.random() * emails.length)
        const SENDER_EMAIL = emails[randomIndex]
        emails.splice(randomIndex, 1) // remove item from array
        randomIndex = Math.floor(Math.random() * emails.length)
        const RECEIVER_EMAIL = emails[randomIndex]
        emails.splice(randomIndex, 1) // remove item from array
        
        let sender_user = await usersCollection.findOne({ email: SENDER_EMAIL })
        let receiver_user = await usersCollection.findOne({ email: RECEIVER_EMAIL })
        
        let existingContact = await contactsCollection.findOne({
            sender_id: sender_user._id.toString(),
            receiver_id: receiver_user._id.toString(),
        })
        if (!existingContact) {
            let newContact = {
                sender_id: sender_user._id.toString(),
                receiver_id: receiver_user._id.toString(),
            }
            await contactsCollection.insertOne(newContact, (err) => {
                // console.log(err)
            })
            console.log(`Test Contact seeded.`)
        }

        now.setMinutes(now.getMinutes() + 5); // add 5 mins to date
        let utc_timestamp = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()); // convert date to utc timestamp

        // console.log(new Date(now).toLocaleString("en-US", { timeZone: "America/Vancouver" })) // beautify output (same output)
        // console.log(new Date(utc_timestamp).toLocaleString("en-US", { timeZone: "America/Vancouver" })) // beautify output (same output)

        let newMessage = {
            sender_id: sender_user._id.toString(),
            receiver_id: receiver_user._id.toString(),
            message: faker.lorem.words(15),
            sent_at: utc_timestamp // will be stored as UTC timestamp
        }
        await messagesCollection.insertOne(newMessage, (err) => {
            // console.log(err)
        })
    }
    console.log(`Test Messages seeded.`)
}