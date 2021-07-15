const userService = require('../service/userService');
const messageService = require('../service/messageService')
const constants = require('../constants/index');
const dbHelper = require('../helper/dbHelper');

module.exports.homePage = async (req, res) => {
    // get contact list of authenticated user
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
    req.body.token = token
    let user = await userService.getUserFromToken(token)

    let data = {}
    
    const { contactList } = await messageService.homePage(req.body)
    // console.log({ contactList })

    let recipientSelected;
    if (req.params.id_recipient!=null) {
        // start/select message with the recipient
        // chatbox is displayed with the recipient
        recipientSelected = true;
        let recipient = await messageService.getRecipient(req.params.id_recipient)
        data.recipient = recipient[0]
    } else {
        // show general listing of all contacts (no selection)
        // chatbox is not displayed
        // when a contact is clicked, load its messages with that user
        recipientSelected = false;
    }
    data.recipientSelected = recipientSelected
    data.contactList = contactList
    

    res.render('messages', {
        layout: 'layout.chat.handlebars',
        pageTitle: 'BarberX - My messages',
        user,
        data
    })
}

module.exports.getMessages = async (req, res) => {
    let token = req.cookies._authToken || req.headers.authorization.split('Bearer ')[1];
    let currentUserId = await userService.getUserIdFromToken(token)
    let messages = await messageService.getMessages(req.params.id_recipient, currentUserId)
    // console.log({messages})
    res.json(messages);
}

module.exports.sendMessageToUser = async (req, res) => {
    let response = { ...constants.defaultServerResponse };

    try {
        const responseFromService = await messageService.sendMessageToUser(req.body)
        // console.log({responseFromService})

        response.status = 200;
        response.message = constants.messageMessage.SAVED_SUCCESS;
        response.body = responseFromService;
    } catch (e) {
        console.log('Something went wrong: Controller: sendMessageToUser', e);
        response.message = e.message;
    }

    return res.status(response.status).send(response);
}