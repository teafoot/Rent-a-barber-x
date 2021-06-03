const mongoose = require('mongoose');
const userService = require('../service/userService');

module.exports.homePage = async (req, res) => {
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1]; // get the token from cookies OR request headers if not found
    const user = await userService.getUserFromToken(token)
    // console.log(user)

    res.render('home', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Home',
        user
    })
}

module.exports.profilePage = async (req, res) => {
    let token = req.cookies._authToken;
    const user = await userService.getUserFromToken(token)
    // console.log(user)

    res.render('profile', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Profile',
        user
    })
}