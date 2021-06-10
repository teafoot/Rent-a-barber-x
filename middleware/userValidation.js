const constants = require('../constants/index');
const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel');
const userService = require('../service/userService');

module.exports.onlyBarberAccess = async (req, res, next) => {
    try {
        let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
        const user = await userService.getUserFromToken(token)
        // console.log({user})

        if (user.user_type == "barber") {
            return next();
        } else {
            throw new Error(constants.requestValidationMessage.NOT_BARBER);
        }
    } catch(e) {
        res.locals.message = e.message;
        const status = e.status || 401;
        res.locals.status = status;
        res.status(status);
        // return res.render('error'); // for debugging
        return res.redirect('/home');;
    }
}