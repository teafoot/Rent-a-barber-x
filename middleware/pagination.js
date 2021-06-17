// const User = require('../database/models/userModel');

// module.exports.paginateResults = async (req, res, next) => {
//     try {
//         const page = parseInt(req.query.page);
//         const limit = parseInt(req.query.limit);

//         const skipIndex = (page - 1) * limit;

//         const results = {};
//         results.results = await User.find()
//             .sort({ _id: 1 })
//             .limit(limit)
//             .skip(skipIndex)
//             .exec();
//         res.paginatedResults = results;
//         next();
//     } catch (e) {
//         res.status(500).json({ message: "Pagination error occured" });
//     }
// }