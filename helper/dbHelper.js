const constants = require('../constants/index');
const mongoose = require('mongoose');

module.exports.formatMongoData = (data) => {
    if (Array.isArray(data)) {
        let list = [];

        for (value of data) {
            list.push(value.toObject());
        }

        return list;
    }

    return data.toObject();
};

module.exports.checkObjectID = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(constants.databaseMessage.INVALID_ID);
    }
};
