
const mongoose = require('mongoose');
const userService = require('../service/userService');
const barbershopService = require('../service/barbershopService');
const appointmentService = require('../service/appointmentService');
const day = require('../helper/dateGetter');
const constants = require('../constants/index');
//app.use(express.urlencoded())

module.exports.createAppointment = async (req, res) => {
    
    console.log("made a post")
    let response = { ...constants.defaultServerResponse };

    // console.log(req);
    // console.log(req.body);

    const barbershops = await barbershopService.getAllBarbershops()
    // console.log({barbershops})
    const barbers = await userService.getAllBarbers()
    // console.log({barbers})
   // const appointments = await appointmentService.getAppointmentsWhere({id_user: user.id_user});
    const appointments = await appointmentService.getAppointmentsWhere({username: 'adam'});
    try {
        let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
        req.body.token = token
        console.log(req.body.creationTime)
        data = req.body

        

        
        

        console.log(req.body)
      
       // const responseFromService = await barbershopService.createBarbershopService(req.body)
    //    var test = "k"
    //    while(test != null){

    //    }
        let {creationDate, creationTime, title, price, description } = data;
        console.log(data.creationDate)

        console.log(creationDate);
        console.log(creationTime);
        // console.log({responseFromService})

        response.status = 200;
       // response.message = constants.barbershopMessage.BARBERSHOP_SERVICE_CREATION_SUCCESS;
        response.body = responseFromService;
    } catch (e) {
        console.log('Something went wrong: Controller: createBarbershopService', e);
        response.message = e.message;
    }

    //return res.status(response.status).send(response);
    

    res.render('home', {
        layout: 'layout.navbar.handlebars',
        pageTitle: 'BarberX - Service Hair',
        appointments,
        barbers,
        barbershops
        
    })
}