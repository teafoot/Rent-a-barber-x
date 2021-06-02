const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const homeController = require('../controller/homeController')
const tokenValidation = require('../middleware/tokenValidation')

router.get('/login', userController.formLogin)
router.get('/register', userController.formRegister)
router.get('/home', tokenValidation.validateToken, homeController.homePage)
router.get('/logout', tokenValidation.validateToken, userController.logout)

module.exports = router;
