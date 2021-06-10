const express = require('express');
const router = express.Router();

const joiSchemaValidation = require('../middleware/joiSchemaValidation');
const tokenValidation = require('../middleware/tokenValidation')
const userValidation = require('../middleware/userValidation')

const barbershopController = require('../controller/barbershopController');
const barbershopSchema = require('../apiSchema/barbershopSchema');

router.post('/my-barbershop', tokenValidation.validateToken, userValidation.onlyBarberAccess, joiSchemaValidation.validateBody(barbershopSchema.create), barbershopController.createBarbershop, barbershopController.createBarbershopService);
router.post('/my-barbershop/delete-service', tokenValidation.validateToken, userValidation.onlyBarberAccess, joiSchemaValidation.validateBody(barbershopSchema.deleteService), barbershopController.deleteBarbershopService)

module.exports = router;