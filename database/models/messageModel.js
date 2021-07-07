const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender_id: String,
    receiver_id: String,
    message: String,
    sent_at: Number // utc timestamp
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret, options) {
            ret.id_message = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

module.exports = mongoose.model('Message', messageSchema);
