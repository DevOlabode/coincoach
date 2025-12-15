const express = require('express');
const router = express.Router();

const controller = require('../controllers/chatSession');

// Route to display the chat interface
router.get('/', (req, res) => {
    res.render('chat/index');
});

// Route to get all chat sessions for the user
router.get('/sessions', controller.getSessions);

module.exports = router;
