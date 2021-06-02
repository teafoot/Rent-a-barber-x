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

        const newUser = new User({ username, email, password, user_type });
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

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY || 'my-secret-key', { expiresIn: '1d' });

        return { token };
    } catch (e) {
        console.log('Something went wrong: Service: login', e);
        throw new Error(e);
    }
};

module.exports.getUserFromToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'my-secret-key');
        // console.log(decoded) // { id: '60b6dd64595beb03f045a134', iat: 1622650222, exp: 1622736622 }
        const user = await User.findOne({ "_id": decoded.id })
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
