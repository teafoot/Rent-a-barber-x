const mongoose = require('mongoose');
const userService = require('../service/userService');
const barbershopService = require('../service/barbershopService');
// const paginateResult = require('../helper/dbHelper').paginateResult

module.exports.homePage = async (req, res) => {
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1]; // get the token from cookies OR request headers if not found
    const user = await userService.getUserFromToken(token)
    // console.log(user)
    const barbershops = await barbershopService.getAllBarbershops()
    // console.log({barbershops})
    const barbers = await userService.getAllBarbers()
    // console.log({barbers})

    res.render('home', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Home',
        user,
        barbershops,
        barbers
    })
}

// module.exports.homePageApi = async (req, res) => { // for pagination
//     let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1]; // get the token from cookies OR request headers if not found
//     const user = await userService.getUserFromToken(token)
//     // console.log(user)
//     const barbershops = await barbershopService.getAllBarbershops()
//     // console.log({barbershops})
//     const barbers = await userService.getAllBarbers()
//     // console.log({barbers})

//     const result = {};
//     result.user = user
//     result.barbershops = barbershops
//     result.barbers = barbers
//     console.log({result})

//     return result
// }

module.exports.search = async (req, res) => {
    const barbershops = await barbershopService.getBarbershopsWhere(req.query.query)
    const barbers = await userService.getBarbersWhere(req.query.query)
    // console.log({barbers})

    res.render('search-results', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Search Results',
        query: req.query.query,
        barbershops,
        barbers
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

module.exports.profileIDPage = async (req, res) => {
    const user = await userService.getUserById(req.params.id_user)
    // console.log({user})
    const barbershop = await barbershopService.getBarbershopByUserId(user._id)
    // console.log({barbershop})

    res.render('profile_id', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Profile',
        user,
        barbershop
    })
}

module.exports.barbershopIDPage = async (req, res) => {
    const barbershop = await barbershopService.getBarbershopById(req.params.id_barbershop)
    const user = await userService.getUserById(barbershop.id_user)

    res.render('barbershop_id', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Profile',
        user,
        barbershop
    })
}