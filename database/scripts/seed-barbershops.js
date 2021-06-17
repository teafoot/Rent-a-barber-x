const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "rent-a-barber-x-db"
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');
const faker = require("faker");
const assert = require("assert");

MongoClient.connect(url, async function (err, client) {
    assert.equal(null, err);
    const db = client.db(dbName)

    // await seedTestBarbershop(db)
    // await seedTestServices(db)
    await seedTestBarbershopAndServices(db)

    // await seedBarbershop(db)
    // await seedServices(db)
    // await seedBarbershopAndServices(db)

    client.close();
})

async function seedTestBarbershop(db) {
    for (let i = 0; i < 20; i++) { // 20 users
        const EMAIL = `test${i}@test.com` // change this value to create a barbershop for this particular user

        const usersCollection = db.collection("users")
        const barbershopsCollection = db.collection("barbershops")
        let user = await usersCollection.findOne({ email: EMAIL })
        let barbershop = await barbershopsCollection.findOne({ id_user: user._id.toString() })
        // console.log({barbershop})

        if (!barbershop) { // create a barbershop if it doesn't exist
            const USER_ID = user._id.toString()
            const now = new Date()
            let newBarbershop = {
                id_user: USER_ID,
                title: faker.lorem.words(3),
                description: faker.lorem.words(15),
                location: faker.address.city(),
                createdAt: now,
                updatedAt: now,
                services: []
            }
            await barbershopsCollection.insertOne(newBarbershop, (err) => {
                // console.log(err)
            })
            console.log(`Test Barbershop seeded.`)
        } else {
            console.log(`Test Barbershop already exists, skipped seeding.`)
        }
    }
}

async function seedTestServices(db) {
    for (let i = 0; i < 20; i++) { // 20 users
        const EMAIL = `test${i}@test.com` // change this value to create services for this particular user's barbershop
        const MAX_SERVICES = 3 // can change

        const usersCollection = db.collection("users")
        const barbershopsCollection = db.collection("barbershops")
        let user = await usersCollection.findOne({ email: EMAIL })
        let barbershop = await barbershopsCollection.findOne({ id_user: user._id.toString() })
        // console.log({barbershop})

        if (barbershop) { // create services if barbershop exists
            let newServices = []
            for (let i = 0; i < MAX_SERVICES; i++) { // number of services
                let randomUUID = uuidv4()
                let newService = {
                    service_title: faker.lorem.words(3),
                    service_description: faker.lorem.words(15),
                    service_price: faker.datatype.number({
                        'min': 10,
                        'max': 50
                    }),
                    id_service: randomUUID
                }
                newServices.push(newService)
            }
            barbershop.services.push(...newServices)
            await barbershopsCollection.updateOne(// barbershop.markModified("services") // method not found ; // barbershop.save() // method not found
                { id_user: user._id.toString() }, // filter
                { $set: { "services": barbershop.services } } // update
            )// .then(result => {
            // console.log({result})
            // })
            barbershop = await barbershopsCollection.findOne({ id_user: user._id.toString() })
            // console.log("New services: ")
            // console.log(barbershop.services)
            ////console.log(`New services: ${barbershop.services}`) // casts to string [Object]
            console.log(`Test Services seeded.`)
        } else {
            console.log(`Cannot seed Test services, barbershop not found`)
        }
    }
}

async function seedTestBarbershopAndServices(db) {
    await seedTestBarbershop(db)
    await seedTestServices(db)
}

async function seedBarbershop(db) {
    const EMAIL = "Erin77@gmail.com" // change this value to create a barbershop for this particular user

    const usersCollection = db.collection("users")
    const barbershopsCollection = db.collection("barbershops")
    let user = await usersCollection.findOne({ email: EMAIL })
    let barbershop = await barbershopsCollection.findOne({id_user: user._id})
    // console.log({barbershop})
    
    if (!barbershop) { // create a barbershop if it doesn't exist
        const USER_ID = user._id.toString()
        const now = new Date()
        let newBarbershop = {
            id_user: USER_ID,
            title: faker.lorem.words(3),
            description: faker.lorem.words(15),
            location: faker.address.city(),
            createdAt: now,
            updatedAt: now,
            services: []
        }
        await barbershopsCollection.insertOne(newBarbershop, (err) => {
            console.log(err)
        })
        console.log(`Barbershop seeded.`)
    } else {
        console.log(`Barbershop already exists, skipped seeding.`)
    }
}

async function seedServices(db) {
    const EMAIL = "Erin77@gmail.com" // change this value to create services for this particular user's barbershop
    const MAX_SERVICES = 3 // can change

    const usersCollection = db.collection("users")
    const barbershopsCollection = db.collection("barbershops")
    let user = await usersCollection.findOne({ email: EMAIL })
    let barbershop = await barbershopsCollection.findOne({id_user: user._id})
    // console.log({barbershop})

    if(barbershop) { // create services if barbershop exists
        let newServices = []
        for (let i = 0; i < MAX_SERVICES; i++) { // number of services
            let randomUUID = uuidv4()
            let newService = {
                service_title: faker.lorem.words(3),
                service_description: faker.lorem.words(15),
                service_price: faker.datatype.number({
                    'min': 10,
                    'max': 50
                }),
                id_service: randomUUID
            }
            newServices.push(newService)
        }
        barbershop.services.push(...newServices)
        await barbershopsCollection.updateOne(// barbershop.markModified("services") // method not found ; // barbershop.save() // method not found
            { id_user: user._id }, // filter
            { $set: { "services": barbershop.services } } // update
        )// .then(result => {
        // console.log({result})
        // })
        barbershop = await barbershopsCollection.findOne({ id_user: user._id })
        // console.log("New services: ")
        // console.log(barbershop.services)
        ////console.log(`New services: ${barbershop.services}`) // casts to string [Object]
        console.log(`Services seeded.`)
    } else {
        console.log(`Cannot seed services, barbershop not found`)
    }
}

async function seedBarbershopAndServices(db) {
    await seedBarbershop(db)
    await seedServices(db)
}