const constants = require('../constants/index');
const jwt = require('jsonwebtoken');

module.exports.validateToken = (req, res, next) => {
    let response = {...constants.defaultServerResponse};

    try {
        // let token = window.localStorage.getItem("_authToken") // localStorage not defined in Node.js
        let token = req.cookies._authToken;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'my-secret-key');
            // console.log(decoded); // { id: '60b6dd64595beb03f045a134', iat: 1622645821, exp: 1622732221 }
            return next();
        }

        if (!req.headers.authorization) {
            throw new Error(constants.requestValidationMessage.TOKEN_MISSING);
        }

        token = req.headers.authorization.split('Bearer ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'my-secret-key');
        // console.log(decoded);
        return next();
    } catch (e) {
        // response.message = e.message;
        // response.status = 401;
        // response.render('error'); // 500 - response.render is not a function (server.js exception handling)

        // console.log('Error', e);
        res.locals.message = e.message;
        const status = e.status || 401;
        res.locals.status = status;
        res.status(status);
        // return res.render('error'); // for debugging
        return res.render('login');
    }
    
    // return res.status(response.status).send(response);
};
