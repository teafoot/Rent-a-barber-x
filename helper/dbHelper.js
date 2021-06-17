const constants = require('../constants/index');
const mongoose = require('mongoose');

module.exports.formatMongoData = (data) => { // returns object or array of objects
    if (data==null)
        return null

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

// module.exports.paginateResult = (array, page_size, page_number) => {
//     const result = array.slice(page_number * page_size, page_number * page_size + page_size);
//     return result
// }

// module.exports.paginateFromDb = (model, page, limit) => {
//     // const page = parseInt(req.query.page);
//     // const limit = parseInt(req.query.limit);
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const result = {};
//     if (endIndex < (await model.countDocuments().exec())) {
//         result.next = {
//             page: page + 1,
//             limit: limit,
//         }
//     }
//     if (startIndex > 0) {
//         result.previous = {
//             page: page - 1,
//             limit: limit,
//         }
//     }

//     try {
//         const paginatedResults = await model.find().limit(limit).skip(startIndex)
//         return paginatedResults
//     } catch (e) {
//         console.log(e)
//     }
// }