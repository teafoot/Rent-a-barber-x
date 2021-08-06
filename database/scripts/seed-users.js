require('dotenv').config()
const faker = require("faker");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const bcrypt = require('bcrypt');
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

// const url = "mongodb://localhost:27017";
const url = process.env.DB_URL
// const dbName = "rent-a-barber-x-db"
const dbName = process.env.DB_NAME

MongoClient.connect(
    url,
    async function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName)

        await seedTestUsers(db)
        
        // await seedUsers(db)

        client.close();
    }
)

async function seedTestUsers(db) {
    const usersCollection = db.collection("users")

    let users = [];
    for (let i = 0; i < 20; i++) {
        const password = await bcrypt.hash("test", 12);
        const now = new Date();
        let newUser = {
            username: "test" + i,
            email: "test" + i + "@test.com",
            password,
            user_type: Math.random() < 0.5 ? "barber" : "customer",
            profile_image_upload: "default-profile.svg",
            createdAt: now,
            updatedAt: now
        };
        users.push(newUser);
        console.log(newUser.email);
    }
    await usersCollection.insertMany(users, (err) => {
        console.log(err)
    });

    console.log("Test users seeded.")
}

async function seedUsers(db) {
    const usersCollection = db.collection("users")

    let users = [];
    for (let i = 0; i < 3; i++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const password = await bcrypt.hash("test", 12);
        const now = new Date();
        let newUser = {
            username: firstName + lastName,
            email: faker.internet.email(firstName, lastName, "test.com"),
            password,
            user_type: Math.random() < 0.5 ? "barber" : "customer",
            createdAt: now,
            updatedAt: now
        };
        users.push(newUser);
        console.log(newUser.email);
    }
    await usersCollection.insertMany(users, (err) => {
        console.log(err)
    });

    console.log("Users seeded.")
}