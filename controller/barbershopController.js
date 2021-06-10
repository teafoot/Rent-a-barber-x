const userService = require('../service/userService');
const barbershopService = require('../service/barbershopService')
const constants = require('../constants/index');

module.exports.myBarbershop = async (req, res) => {
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
    req.body.token = token

    const myBarbershop = await barbershopService.myBarbershop(req.body)
    // console.log({myBarbershop})

    const user = await userService.getUserFromToken(token)

    res.render('my-barbershop', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - My barbershop',
        myBarbershop,
        user
    })
}

module.exports.createBarbershop = async (req, res, next) => {
    let response = { ...constants.defaultServerResponse };

    try {
        let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
        req.body.token = token

        const responseFromService = await barbershopService.createBarbershop(req.body)
        // console.log({responseFromService})

        response.status = 200;
        response.message = constants.barbershopMessage.REGISTRATION_SUCCESS;
        response.body = responseFromService;
    } catch (e) {
        console.log('Something went wrong: Controller: createBarbershop', e);
        response.message = e.message;
    }

    // return res.status(response.status).send(response);
    next()
}

module.exports.createBarbershopService = async (req, res) => {
    let response = { ...constants.defaultServerResponse };

    try {
        let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
        req.body.token = token

        const responseFromService = await barbershopService.createBarbershopService(req.body)
        // console.log({responseFromService})

        response.status = 200;
        response.message = constants.barbershopMessage.BARBERSHOP_SERVICE_CREATION_SUCCESS;
        response.body = responseFromService;
    } catch (e) {
        console.log('Something went wrong: Controller: createBarbershopService', e);
        response.message = e.message;
    }

    return res.status(response.status).send(response);
}

module.exports.deleteBarbershopService = async (req, res) => {
    let response = { ...constants.defaultServerResponse };

    try {
        let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
        req.body.token = token

        const responseFromService = await barbershopService.deleteBarbershopService(req.body)
        console.log({ responseFromService })

        response.status = 200;
        response.message = constants.barbershopMessage.BARBERSHOP_SERVICE_DELETION_SUCCESS;
        response.body = responseFromService;
    } catch (e) {
        console.log('Something went wrong: Controller: deleteBarbershopService', e);
        response.message = e.message;
    }

    return res.status(response.status).send(response);
}