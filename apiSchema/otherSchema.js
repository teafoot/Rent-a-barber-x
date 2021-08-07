module.exports.createOtherSchema = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
  });