const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    user_type: String,
    profile_image_upload: String,
    profile_status: String
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret, options) {
            ret.id_user = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
});

module.exports = mongoose.model('User', userSchema);
