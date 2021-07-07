const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/userModel');
const userService = require('./userService');
const Contact = require('../database/models/contactModel');
const Message = require('../database/models/messageModel');
const constants = require('../constants/index');
const { formatMongoData } = require('../helper/dbHelper');

module.exports.homePage = async (data) => {
    let { token } = data;

    try {
        const user = await userService.getUserFromToken(token)

        const contactList = await module.exports.getContactList(user)
        const latestMessageWithContacts = await module.exports.getLatestMessageWithContacts(user)
        // console.log({contactList, latestMessageWithContacts})

        // merge data
        for (let i = 0; i < contactList.length; i++) {
            contactList[i]['latestMessage'] = latestMessageWithContacts[`${contactList[i].id_user}`].msg
            
            contactList[i]['latestMessageTimestamp'] = new Date(latestMessageWithContacts[`${contactList[i].id_user}`].timestamp).toLocaleString("en-US", { timeZone: "America/Vancouver", dateStyle: "short", timeStyle: "short" })
        }
        // console.log({ contactList })

        return {contactList}
    } catch (e) {
        console.log('Something went wrong: Service: homePage', e);
        throw new Error(e);
    }
};

module.exports.getContactList = async (user) => {
    try {
        // let contactIds = await Message.find({ sender_id: user._id }).distinct('receiver_id') // not optimized
        let contactIds = await Contact.find({ sender_id: user._id }, { receiver_id: 1, _id: 0 })
        // console.log({contactIds})

        var contactList = []
        for (let i = 0;i<contactIds.length;i++) {
            let contact = await User.find({ "_id": contactIds[i].receiver_id })
            // console.log({contact})
            contactList.push(formatMongoData(contact[0]))
        }
        // console.log({contactList})
        return contactList
    } catch (e) {
        console.log('Something went wrong: Service: getContactList', e);
        throw new Error(e);
    }
};

// retrieves the latest message with every contact of the user
module.exports.getLatestMessageWithContacts = async (user) => {
    try {
        let contactIds = await Contact.find({ sender_id: user._id }, { receiver_id: 1, _id: 0 })
        // console.log("getLatestMessageWithContacts", {contactIds})

        let result = {}
        for (let i = 0; i < contactIds.length; i++) {
            let latestContactMessage = await Message.find({ sender_id: user._id, receiver_id: contactIds[i].receiver_id }, { 'message': 1, 'sent_at': 1, _id: 0 }).sort({ sent_at: -1 }).limit(1)
            let latestUserMessage = await Message.find({ receiver_id: user._id, sender_id: contactIds[i].receiver_id }, { 'message': 1, 'sent_at': 1, _id: 0 }).sort({ sent_at: -1 }).limit(1)
            // console.log({latestContactMessage, latestUserMessage})

            if (latestContactMessage[0].sent_at > latestUserMessage[0].sent_at) { // compares the latest message timestamp between user and contact
                result[`${contactIds[i].receiver_id}`] = { msg: latestContactMessage[0].message, timestamp: latestContactMessage[0].sent_at}
            } else {
                result[`${contactIds[i].receiver_id}`] = { msg: latestUserMessage[0].message, timestamp: latestUserMessage[0].sent_at}
            }
            // console.log("getLatestMessageWithContacts - result", result)
        }

        return result
    } catch (e) {
        console.log('Something went wrong: Service: getLatestMessageWithContacts', e);
        throw new Error(e);
    }
};

module.exports.getRecipient = async (recipient_id) => {
    try {
        let contact = await User.find({ "_id": recipient_id })
        return contact;
    } catch (e) {
        console.log('Something went wrong: Service: getRecipient', e);
        throw new Error(e);
    }
};

module.exports.getMessages = async (id_recipient, id_user) => {
    try {
        let messages = await Message.find({ $or: [{ sender_id: id_user, receiver_id: id_recipient }, { sender_id: id_recipient, receiver_id: id_user }] }).sort({ sent_at: 1 }).collation({ locale: "en_US", numericOrdering: true })
        // console.log({messages})

        return formatMongoData(messages);
    } catch (e) {
        console.log('Something went wrong: Service: getMessages', e);
        throw new Error(e);
    }
};

module.exports.sendMessageToUser = async (data) => { // TODO
    let { sender_id, receiver_id, message, sent_at } = data;

    try {
        const newMessage = new Message({ 
            sender_id,
            receiver_id,
            message,
            sent_at
        })
        // console.log({newMessage})
        result = await newMessage.save();

        return formatMongoData(result);
    } catch (e) {
        console.log('Something went wrong: Service: sendMessageToUser', e);
        throw new Error(e);
    }
};
module.exports.sendMessageToUserSocket = function (io) {
    io.sockets.on('connection', function (socket) {
        socket.on('subscribe', function (room) {
            socket.join(room);
        });
        socket.on("send_private_message", function (data) {
            // const connectedClientsArray = Object.keys(io.sockets.adapter.rooms[data.room].sockets); // get a list of connected sockets/clients to room
            // if (data.socketId in connectedClientsArray) {
                io.sockets.in(data.room).emit('render_private_message', data.createdMessage); // includes emitting socketId
                // socket.broadcast.to(data.room).emit('private_message', data.msg); // doesn't include emitting socketId
                // io.to(data.socketId).emit('private_message', data.msg); // send to specific socketid client
            // }
        });
    });
}
