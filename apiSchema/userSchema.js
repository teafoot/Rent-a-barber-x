const Joi = require('@hapi/joi');

module.exports.signup = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .options({
            language: {
                any: {
                    allowOnly: '!!Passwords do not match',
                }
            }
        }),
    user_type: Joi.string().required()
});

module.exports.login = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
});

module.exports.profile = Joi.object().keys({
    profile_image_upload: Joi.string().allow(null, ''),
    profile_status: Joi.string().allow(null, '')
});