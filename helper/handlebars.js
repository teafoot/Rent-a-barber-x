module.exports = {
    ifEquals: function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    counter: function (index) { // to start count from 1 and not 0
        return index + 1;
    }
}

// Handlebars.registerHelper('ifEquals', function (v1, v2, options) {
//     if (v1 === v2) {
//         return options.fn(this);
//     }
//     return options.inverse(this);
// })