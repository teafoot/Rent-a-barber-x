const Joi = require('@hapi/joi');
const constants = require('../constants/index');

const validateObjectSchema = (data, schema) => {
    const result = Joi.validate(data, schema, { convert: false, abortEarly: false }); // abortEarly false - to get all errors in the model
    // console.log(result.error.details)

    if (result.error) {
        const errorDetails = result.error.details.map(value => {
            value.message = value.message.replace(/["]/g, '') // clean the error messages
            value.path = value.path[0]

            return {
                error: value.message,
                path: value.path
            }
            // return {
            //     error: value.message,
            //     path: value.path
            // }
        });

        return errorDetails;
    }

    return null;
};

module.exports.validateBody = (schema) => {
    return (req, res, next) => {
        let response = { ...constants.defaultServerResponse };

        const error = validateObjectSchema(req.body, schema);
        if (error) {
            response.body = error;
            response.message = constants.requestValidationMessage.BAD_REQUEST;
            return res.status(response.status).send(response);
        }

        return next();
    }
};

module.exports.validateQueryParams = (schema) => {
    return (req, res, next) => {
        let response = { ...constants.defaultServerResponse };

        const error = validateObjectSchema(req.query, schema);
        if (error) {
            response.body = error;
            response.message = constants.requestValidationMessage.BAD_REQUEST;
            return res.status(response.status).send(response);
        }

        return next();
    }
};
