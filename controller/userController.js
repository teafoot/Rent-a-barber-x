const userService = require('../service/userService');
const constants = require('../constants/index');

module.exports.formRegister = (req, res) => {
    res.render('register', {
        pageTitle: 'BarberX - Register'
    })
}

module.exports.formLogin = (req, res) => {
    res.render('login', {
        pageTitle: 'BarberX - Login'
    })
}

module.exports.signup = async (req, res) => {
    let response = { ...constants.defaultServerResponse };

    try {
        // console.log(req.body)
        const responseFromService = await userService.signup(req.body)

        response.status = 200;
        response.message = constants.userMessage.SIGNUP_SUCCESS;
        response.body = responseFromService;
    } catch (e) {
        console.log('Something went wrong: Controller: signup', e);
        response.message = e.message;
    }

    return res.status(response.status).send(response);
};

module.exports.login = async (req, res) => {
    let response = { ...constants.defaultServerResponse };

    try {
        const responseFromService = await userService.login(req.body);
        res.cookie('_authToken', responseFromService.token, { 
            maxAge: 24 * 60 * 60 * 1000 // 24h 
        });

        response.status = 200;
        response.message = constants.userMessage.LOGIN_SUCCESS;
        response.body = responseFromService;
    } catch (e) {
        console.log('Something went wrong: Controller: login', e);
        response.message = e.message;
    }

    return res.status(response.status).send(response);
};

module.exports.logout = async (req, res) => {
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, "", { expires: new Date(0), maxAge: 0 });
    }

    res.redirect('/login');
}