const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    id_barbershop: String,
    id_barber: String,
    id_customer: String,
    appointment_status: String,
    services: Array,
    prices: String,
    payment_status: String
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret, options) {
           ret.id_product = ret._id;
           delete ret._id;
           delete ret.__v;
           return ret;
        }
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);