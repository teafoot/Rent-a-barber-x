
const mongoose = require('mongoose');
const userService = require('../service/userService');
const barbershopService = require('../service/barbershopService');
const appointmentService = require('../service/appointmentService');
const day = require('../helper/dateGetter');
const constants = require('../constants/index');
//app.use(express.urlencoded())

module.exports.createAppointment = async (req, res) => {
    let response = { ...constants.defaultServerResponse };

    const barbershops = await barbershopService.getAllBarbershops()
    const barbers = await userService.getAllBarbers()
   // const appointments = await appointmentService.getAppointmentsWhere({id_customer: '60fa0eddf7d045431cca532b'});
    const appointments = [{
        id_barbershop: "123",
        id_barber: "123",
        id_customer: "60fa0eddf7d045431cca532b",
        appointment_status: "active",
        datetime: "July 25th, 2021 at 11:30 AM",
        location: "Located at: 6759 Pinetree Ave, Coquitlam",
        services: [
            { name: "Buzzcut", price: "15.00" },
            { name: "Dye Hair Blue", price: "25.00" },
            { name: "Beard Trim", price: "7.50" }
        ],
        prices: "47.50",
        payment_status: "complete"
    }]
        let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
        req.body.token = token
        console.log(req.body.creationTime)
        data = req.body
        console.log(req.body)
      
        let {creationDate, creationTime, title, price, description } = data;
        console.log(data.creationDate)

        console.log(creationDate);
        console.log(creationTime);

    res.render('home', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Service Hair',
        appointments,
        barbers,
        barbershops
        
    })
}