const userService = require('../service/userService');
const shortid = require('shortid');
const fs = require('fs')
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

module.exports.uploadProfilePicture = async (req, res, next) => {
    if (req.file !== undefined) {
        const fileExtension = req.file.mimetype.split('/')[1];
        // var file = req.file.destination + '/' + req.file.filename + '.' + fileExtension;
        const fileName = `${shortid.generate()}.${fileExtension}`
        var file = req.file.destination + '/' + fileName;

        res.locals.profile_image_upload = fileName

        fs.rename(req.file.path, file, function (err) {
            if (err) {
                console.log(err);
                // res.send(500);
            }
        });

        // delete old uploaded image
        let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
        const user = await userService.getUserFromToken(token)
        const oldPicture = user.profile_image_upload
        const removeFilePath = req.file.destination + "/" + oldPicture
        // console.log(removeFilePath)
        fs.unlink(removeFilePath, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })
    } else {
        res.locals.profile_image_upload =  ""
    }

    next()
}

module.exports.saveProfile = async (req, res) => {
    let response = { ...constants.defaultServerResponse };

    try {
        req.body.profile_image_upload = res.locals.profile_image_upload

        let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
        req.body.token = token

        const responseFromService = await userService.saveProfile(req.body)

        response.status = 200;
        response.message = constants.userMessage.PROFILE_VALID_SAVE;
        response.body = responseFromService;
    } catch (e) {
        console.log('Something went wrong: Controller: saveProfile', e);
        response.message = e.message;
    }

    console.log(response)
    res.redirect('/profile');
    // return res.status(response.status).send(response);
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