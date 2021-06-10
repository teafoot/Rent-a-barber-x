const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel');
const userService = require('./userService');
const Barbershop = require('../database/models/barbershopModel');
const constants = require('../constants/index');
const { formatMongoData } = require('../helper/dbHelper');

module.exports.myBarbershop = async (data) => {
    let { token } = data;

    try {
        const user = await userService.getUserFromToken(token)
        let barbershop = await Barbershop.findOne({ id_user: user._id })
        return formatMongoData(barbershop);
    } catch (e) {
        console.log('Something went wrong: Service: myBarbershop', e);
        throw new Error(e);
    }
};

module.exports.createBarbershop = async (data) => {
    let { token, title, description, location } = data;

    try {
        const user = await userService.getUserFromToken(token)

        // let barbershop = { title, description, location }
        // user.barbershop = barbershop
        // let result = await user.save();

        let barbershop = await Barbershop.findOne({id_user: user._id})
        let result
        if (!barbershop) {
            const newBarbershop = new Barbershop({id_user: user._id, title, description, location})
            result = await newBarbershop.save();
        } else {
            // barbershop.id_user = user.id_user // undefined
            barbershop.id_user = user._id
            barbershop.title = title
            barbershop.description = description
            barbershop.location = location
            result = await barbershop.save();
        }

        return formatMongoData(result);
    } catch (e) {
        console.log('Something went wrong: Service: saveProfile', e);
        throw new Error(e);
    }
};

module.exports.createBarbershopService = async (data) => {
    let { token, myServices } = data;
    // console.log({data})
    // console.log(myServices)

    if (!myServices) {// api middleware automatically calls this, reject it when no barbershop services are created (only the barberstore info is being saved)
        return
    }

    try {
        const user = await userService.getUserFromToken(token)

        let barbershop = await Barbershop.findOne({ id_user: user._id })
        let result
        if (!barbershop) {
            throw new Error('Barbershop not found');
        } else {
            let services = barbershop.services
            Object.keys(myServices).forEach(key => {
                // console.log(key, myServices[key])
                let existingServiceIndex = services.findIndex(service => service.id_service == key)
                if (existingServiceIndex == -1) {// not found, create
                    myServices[key]['id_service'] = key // append id
                    services.push(myServices[key])
                } else { // replace existing
                    myServices[key]['id_service'] = key // append id
                    services[existingServiceIndex] = myServices[key]
                }
            });
            // console.log({services})
            
            barbershop.services = services
            barbershop.markModified("services") // notify mongooose the attribute's value has changed
            result = await barbershop.save();
        }

        return formatMongoData(result);
    } catch (e) {
        console.log('Something went wrong: Service: createBarbershopService', e);
        throw new Error(e);
    }
};

module.exports.deleteBarbershopService = async (data) => {
    let { token, serviceID } = data;
    // console.log({ data })

    try {
        const user = await userService.getUserFromToken(token)

        let barbershop = await Barbershop.findOne({ id_user: user._id })
        let result
        if (!barbershop) {
            throw new Error('Barbershop not found');
        } else {
            // console.log(JSON.stringify(barbershop.services))
            const filteredServices = barbershop.services.filter(service => service.id_service != serviceID)

            barbershop.services = filteredServices
            result = await barbershop.save();
        }

        return formatMongoData(result);
    } catch (e) {
        console.log('Something went wrong: Service: createBarbershopService', e);
        throw new Error(e);
    }
};