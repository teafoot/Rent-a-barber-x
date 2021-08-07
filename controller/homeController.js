const mongoose = require('mongoose');
const userService = require('../service/userService');
const barbershopService = require('../service/barbershopService');
const appointmentService = require('../service/appointmentService');
const day = require('../helper/dateGetter');
// const paginateResult = require('../helper/dbHelper').paginateResult

module.exports.landingPage = async (req, res) => {
    res.render('landing', {
        // layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Landing'
    })
}

module.exports.homePage = async (req, res) => {
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1]; // get the token from cookies OR request headers if not found
    const user = await userService.getUserFromToken(token)
    // console.log(user)
    const barbershops = await barbershopService.getAllBarbershops()
    // console.log({barbershops})
    const barbers = await userService.getAllBarbers()
    // console.log({barbers})

    // const appointments = await appointmentService.getAppointmentsWhere({id_user: user.id_user});
    const appointments = await appointmentService.getAppointmentsWhere({ username: 'adam' });
    const first = await day.dateGetter.firstDay();

    if (user.user_type == 'barber') {
        var result = true;
        var isBarber = new Object();
        isBarber.isBarber = result;
    }

    res.render('home', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Home',
        user,
        barbershops,
        barbers,
        appointments,
        isBarber
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

    let token = req.cookies._authToken;
    const user = await userService.getUserFromToken(token)

    res.render('search-results', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Search Results',
        query: req.query.query,
        barbershops,
        barbers,
        user
    })
}

module.exports.profilePage = async (req, res) => {
    let token = req.cookies._authToken;
    const user = await userService.getUserFromToken(token)
    // console.log({user})

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

module.exports.serviceHair = async (req, res) => {
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1]; // get the token from cookies OR request headers if not found
    const user = await userService.getUserFromToken(token)

    const barbershops = await barbershopService.getAllBarbershops()

    const barbers = await userService.getAllBarbers()

    //const appointments = await appointmentService.getAppointmentsWhere({username: 'adam'});

    console.log("Here are appointments:")

    console.log("ID:")
    console.log(user.id_user);
    const first = await day.dateGetter.firstDay();
    console.log(first);
    //console.log(firstDay);


    res.render('serviceHair', {
        layout: 'layout.handlebars',
        pageTitle: 'BarberX - Service Hair',
        user,
    })
}

module.exports.serviceDye = async (req, res) => {
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1]; // get the token from cookies OR request headers if not found
    const user = await userService.getUserFromToken(token)

    const barbershops = await barbershopService.getAllBarbershops()

    const barbers = await userService.getAllBarbers()

    //const appointments = await appointmentService.getAppointmentsWhere({username: 'adam'});

    console.log("Here are appointments:")

    console.log("ID:")
    console.log(user.id_user);
    const first = await day.dateGetter.firstDay();
    console.log(first);
    //console.log(firstDay);


    res.render('serviceDye', {
        layout: 'layout.handlebars',
        pageTitle: 'BarberX - Service Hair',
        user,
    })
}

module.exports.serviceOther = async (req, res) => {
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1]; // get the token from cookies OR request headers if not found
    const user = await userService.getUserFromToken(token)

    const barbershops = await barbershopService.getAllBarbershops()

    const barbers = await userService.getAllBarbers()

    //const appointments = await appointmentService.getAppointmentsWhere({username: 'adam'});

    console.log("Here are appointments:")

    console.log("ID:")
    console.log(user.id_user);
    const first = await day.dateGetter.firstDay();
    console.log(first);
    //console.log(firstDay);


    res.render('serviceOther', {
        layout: 'layout.handlebars',
        pageTitle: 'BarberX - Service Hair',
        user,
    })
}


module.exports.appointment = async (req, res) => {
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1]; // get the token from cookies OR request headers if not found
    const user = await userService.getUserFromToken(token)


    const barbershops = await barbershopService.getAllBarbershops()
    const barbershop = await barbershopService.getBarbershopByUserId(req.params.id_user);
    // var barberID = mongoose.Types.ObjectId(barbershop.id_user)

    //  const barber = await userService.getUserById(barberID);


    console.log(barbershop.id_user);
    //const barber = await userService;


    //const appointments = await appointmentService.getAppointmentsWhere({username: 'adam'});
    console.log("lol")
    // console.log({profile_id})
    // console.log(barber);
    // console.log(barber);
    //console.log(barber);
    console.log(barbershop);
    console.log(req.params);
    console.log("Here are appointments:")

    console.log("ID:")
    console.log(user.id_user);
    console.log(user);
    const first = await day.dateGetter.firstDay();

    //console.log(firstDay);


    res.render('createAppointment', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Service Hair',
        user,
        barbershop,
    })
}