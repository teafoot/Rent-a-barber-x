const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const homeController = require('../controller/homeController')
const barbershopController = require('../controller/barbershopController')
const messageController = require('../controller/messageController')
const tokenValidation = require('../middleware/tokenValidation')
const userValidation = require('../middleware/userValidation')
// const paginateResults = require('../middleware/pagination').paginateResults

// base route - redirect to login form or homepage
router.get('/', tokenValidation.validateToken, (req, res, next) => {
    res.redirect('/home');
});

router.get('/login', userController.formLogin)
router.get('/register', userController.formRegister)
router.get('/home', tokenValidation.validateToken, homeController.homePage)
router.get('/search', tokenValidation.validateToken, homeController.search)
router.get('/profile', tokenValidation.validateToken, homeController.profilePage)
router.get('/logout', tokenValidation.validateToken, userController.logout)

router.get('/my-barbershop', tokenValidation.validateToken, userValidation.onlyBarberAccess, barbershopController.myBarbershop)

router.get('/profile_id/:id_user', tokenValidation.validateToken, homeController.profileIDPage)
router.get('/barbershop_id/:id_barbershop', tokenValidation.validateToken, homeController.barbershopIDPage)

router.get('/messages', tokenValidation.validateToken, messageController.homePage)
router.get('/messages/:id_recipient', tokenValidation.validateToken, userValidation.sendMessageNotToSelf, messageController.homePage)

module.exports = router;
