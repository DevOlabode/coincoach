const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatMessage');
const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

// Get messages for a session
router.get('/:sessionId/messages', controller.getSessionMessages);

// Create new message
router.post('/:sessionId/messages', controller.createMessage);

// Update message
router.patch('/messages/:messageId', controller.updateMessage);

// Delete message
router.delete('/messages/:messageId', controller.deleteMessage);

module.exports = router;