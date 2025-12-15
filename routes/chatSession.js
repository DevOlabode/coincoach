const express = require('express');
const router = express.Router();

// Route to display the chat interface
router.get('/', (req, res) => {
    res.render('chat/index');
});

module.exports = router;
