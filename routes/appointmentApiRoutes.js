const express = require('express');
const router = express.Router();

// const joiSchemaValidation = require('../middleware/joiSchemaValidation');
const tokenValidation = require('../middleware/tokenValidation')
const userValidation = require('../middleware/userValidation')

const appointmentController = require('../controller/appointmentController');
const barbershopSchema = require('../apiSchema/barbershopSchema');

router.post('/create', tokenValidation.validateToken, appointmentController.createAppointment);
//router.post('/my-barbershop/delete-service', tokenValidation.validateToken, userValidation.onlyBarberAccess, joiSchemaValidation.validateBody(barbershopSchema.deleteService), barbershopController.deleteBarbershopService)

module.exports = router;