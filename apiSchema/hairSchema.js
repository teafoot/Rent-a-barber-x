module.exports.createHairSchema = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    gender: Joi.string().required(),
    length: Joi.string().required()
  });