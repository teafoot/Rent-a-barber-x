

exports.dateGetter = {

       

    getDaysInMonth: function(month, year) {
        return new Date(year, month, 0).getDate()
    },

    firstDay: function(){
        date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },
    lastDay: function(){
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
};

