const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatAI');
const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

// Generate AI response
router.post('/generate', controller.generateResponse);

module.exports = router;