module.exports.createDyeSchema = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    colour: Joi.string().required()
  });