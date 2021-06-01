const constants = require('../constants/index');
const jwt = require('jsonwebtoken');

module.exports.validateToken = (req, res, next) => {
    let response = {...constants.defaultServerResponse};

    try {
        if (!req.headers.authorization) {
            throw new Error(constants.requestValidationMessage.TOKEN_MISSING);
        }

        const token = req.headers.authorization.split('Bearer ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'my-secret-key');
        console.log(decoded);
        
        return next();
    } catch (e) {
        console.log('Error', e);
        
        response.message = e.message;
        response.status = 401;
    }
    
    return res.status(response.status).send(response);
};
