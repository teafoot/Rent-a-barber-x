const mongoose = require('mongoose');

const barbershopSchema = new mongoose.Schema({
    id_user: String,
    title: String,
    description: String,
    location: String,
    services: Array
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret, options) {
            ret.id_barbershop = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

module.exports = mongoose.model('Barbershop', barbershopSchema);
