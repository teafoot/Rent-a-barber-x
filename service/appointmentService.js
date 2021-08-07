const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel');
const userService = require('./userService');
const Appointment = require('../database/models/appointmentModel');
const constants = require('../constants/index');
const { formatMongoData } = require('../helper/dbHelper');


module.exports.getAppointments = async () => {
    try {
        let barbershops = await Barbershop.find();
        return formatMongoData(barbershops);
    } catch (e) {
        console.log('Something went wrong: Service: getAllAppointments', e);
        throw new Error(e);
    }
};

module.exports.getAppointmentsWhere = async (query) => {
    try {
        if (query!="") {
            let appointments = await Appointment.find({ $or: [
                {id_customer: { $regex: ".*" + query + ".*", $options: 'i' }},
                {id_barber: { $regex: ".*" + query + ".*", $options: 'i' }}
            ]}, function (err, result) {
                // console.log(err);
            });
            // console.log(formatMongoData(barbershops))
            return formatMongoData(appointments);
        } else {
            let appointments = await Appointment.find();
            return formatMongoData(appointments);
        }
    } catch (e) {
        console.log('Something went wrong: Service: getAllAppointmentsWhere', e);
        throw new Error(e);
    }
};