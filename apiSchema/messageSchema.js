const Joi = require('@hapi/joi');

module.exports.send_message = Joi.object().keys({
    sender_id: Joi.string().required(),
    receiver_id: Joi.string().required(),
    message: Joi.string().required(),
    sent_at: Joi.string().required() // utc timestamp
});