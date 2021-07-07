const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel');
const constants = require('../constants/index');
const { formatMongoData } = require('../helper/dbHelper');

module.exports.signup = async (data) => {
    let {username, email, password, user_type} = data;

    try {
        const user = await User.findOne({ email });
        if (user) {
            throw new Error(constants.userMessage.DUPLICATE_EMAIL);
        }

        password = await bcrypt.hash(password, 12);
        let profile_image_upload = "default-profile.svg"

        const newUser = new User({ username, email, password, user_type, profile_image_upload });
        let result = await newUser.save();

        return formatMongoData(result);
    } catch (e) {
        console.log('Something went wrong: Service: signup', e);
        throw new Error(e);
    }
};

module.exports.login = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error(constants.userMessage.USER_NOT_FOUND);
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error(constants.userMessage.INVALID_PASSWORD);
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY || 'my-secret-key', { expiresIn: '1d' });

        return { token };
    } catch (e) {
        console.log('Something went wrong: Service: login', e);
        throw new Error(e);
    }
};

module.exports.getUserFromToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'my-secret-key');
        // console.log(decoded) // { id: '60b6dd64595beb03f045a134', iat: 1622650222, exp: 1622736622 }
        // const user = await User.findOne({ "_id": decoded.id }) // not working anymore for some reason...
        const user = await User.findOne({ "email": decoded.email }, {
            "profile_image_upload": 1,
            "profile_status": 1,
            "user_type": 1,
            username: 1,
            email: 1
        })
        // console.log(user) // { email: 'test9@test.com', createdAt: 2021 - 06 - 02T01: 22: 44.055Z, updatedAt: 2021 - 06 - 02T01: 22: 44.055Z, id_user: 60b6dd64595beb03f045a134 }
        if (!user) {
            throw new Error(constants.userMessage.USER_NOT_FOUND);
        }

        return user
    } catch (e) {
        console.log('Something went wrong: Service: getUserFromToken', e);
        throw new Error(e);
    }
};

module.exports.getUserById = async (id) => {
    try {
        const user = await User.findOne({ "_id": id }, {
            "profile_image_upload": 1,
            "profile_status": 1,
            "user_type": 1,
            username: 1,
            email: 1
        })
        if (!user) {
            throw new Error(constants.userMessage.USER_NOT_FOUND);
        }

        return user
    } catch (e) {
        console.log('Something went wrong: Service: getUserById', e);
        throw new Error(e);
    }
}

module.exports.getUserIdFromToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'my-secret-key');
        return decoded.id
    } catch (e) {
        console.log('Something went wrong: Service: getUserIdFromToken', e);
        throw new Error(e);
    }
};

module.exports.getAllBarbers = async () => {
    try {
        const barbers = await User.find({ "user_type": "barber" })
        if (!barbers) {
            throw new Error(constants.userMessage.BARBERS_NOT_FOUND);
        }

        return barbers
    } catch (e) {
        console.log('Something went wrong: Service: getAllBarbers', e);
        throw new Error(e);
    }
};

module.exports.getBarbersWhere = async (query) => {
    try {
        if (query != "") {
            let barbers = await User.find({
                $or: [
                    { username: { $regex: ".*" + query + ".*", $options: 'i' } }
                ],
                $and: [
                    { user_type: { $eq: "barber" }}
                ]
            }, function (err, result) {
                // console.log(err);
            });
            // console.log(formatMongoData(barbers))
            return formatMongoData(barbers);
        } else {
            const barbers = await User.find({ "user_type": "barber" })
            if (!barbers) {
                throw new Error(constants.userMessage.BARBERS_NOT_FOUND);
            }
            return formatMongoData(barbers);
        }
    } catch (e) {
        console.log('Something went wrong: Service: getBarbersWhere', e);
        throw new Error(e);
    }
};

module.exports.saveProfile = async (data) => {
    let { token, profile_image_upload, profile_status } = data;

    try {
        // const user = await User.findOne({ email });
        const user = await module.exports.getUserFromToken(token)
        user.profile_status = profile_status

        if (profile_image_upload) {
            user.profile_image_upload = profile_image_upload;
        }

        let result = await user.save();
        
        return formatMongoData(result);
    } catch (e) {
        console.log('Something went wrong: Service: saveProfile', e);
        throw new Error(e);
    }
}