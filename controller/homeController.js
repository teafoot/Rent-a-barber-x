const mongoose = require('mongoose');
const userService = require('../service/userService');

module.exports.homePage = async (req, res) => {
    let token = req.cookies._authToken;
    const user = await userService.getUserFromToken(token)
    // console.log(user)

    res.render('home', {
        pageTitle: 'BarberX - Home',
        user
    })
}
