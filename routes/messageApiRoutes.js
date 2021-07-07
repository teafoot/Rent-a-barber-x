const express = require('express');
const router = express.Router();

const joiSchemaValidation = require('../middleware/joiSchemaValidation');
const tokenValidation = require('../middleware/tokenValidation')

const messageController = require('../controller/messageController');
const messageSchema = require('../apiSchema/messageSchema');

router.post('/send-message/:recipient_id', tokenValidation.validateToken, joiSchemaValidation.validateBody(messageSchema.send_message), messageController.sendMessageToUser);
router.get('/get-contact-messages/:id_recipient', tokenValidation.validateToken, messageController.getMessages)

module.exports = router;