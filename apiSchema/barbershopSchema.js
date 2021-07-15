const Joi = require('@hapi/joi');

module.exports.create = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    // location: Joi.string().required(),
    // myServices: Joi.object().allow(null, '')
    // {
    //  '4f1a58e7-661e-428d-a7a3-b4ee8430e296': { service_title: '', service_description: '', service_price: '' },
    //  'sd45de4w-123a-428d-a7a3-b4ee8430e296': { service_title: '', service_description: '', service_price: '' }
    // }
    myServices: Joi.object().pattern(/\w{1,50}/, Joi.alternatives().try(Joi.object().keys({
        service_title: Joi.string().required().error(() => 'Service title is required'),
        service_description: Joi.string().allow(null, ''),
        service_price: Joi.string().regex(/^\d+(\.\d{1,2})?$/).required().error(() => 'Service price is required and only accepts numbers'),
    })))

    // FOR ARRAYS
    // myServices: Joi.array().allow(null, '').items({
    //     // for single values
    //     // service_title: Joi.string().required(),
    //     // service_description: Joi.string().allow(null, ''),
    //     // service_price: Joi.string().regex(/^\d+(\.\d{1,2})?$/).required() // number or decimal number

    //     // for multi-values
    //     service_title: Joi.alternatives().try(
    //         Joi.array().items(Joi.string()), // order matters
    //         Joi.string().required()
    //     ),
    //     service_description: Joi.alternatives().try(
    //         Joi.array().items(Joi.string().allow(null, '')), // order matters
    //         Joi.string().allow(null, '')
    //     ),
    //     service_price: Joi.alternatives().try(
    //         Joi.array().items(Joi.string().regex(/^\d+(\.\d{1,2})?$/)), // order matters
    //         Joi.string().regex(/^\d+(\.\d{1,2})?$/).required()
    //     )
    // }).max(10)
});

module.exports.deleteService = Joi.object().keys({
    serviceID: Joi.string().required()
})