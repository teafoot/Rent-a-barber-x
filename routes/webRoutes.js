const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const homeController = require('../controller/homeController')
const barbershopController = require('../controller/barbershopController')
const tokenValidation = require('../middleware/tokenValidation')
const userValidation = require('../middleware/userValidation')

router.get('/login', userController.formLogin)
router.get('/register', userController.formRegister)
router.get('/home', tokenValidation.validateToken, homeController.homePage)
router.get('/profile', tokenValidation.validateToken, homeController.profilePage)
router.get('/logout', tokenValidation.validateToken, userController.logout)

router.get('/my-barbershop', tokenValidation.validateToken, userValidation.onlyBarberAccess, barbershopController.myBarbershop)

module.exports = router;
