const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    sender_id: String,
    receiver_id: String,
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret, options) {
            ret.id_contact = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

module.exports = mongoose.model('Contact', contactSchema);
