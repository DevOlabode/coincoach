const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatSession');
const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

// Display chat interface
router.get('/', controller.index);

// Get all sessions
router.get('/sessions', controller.getSessions);

// Create new session
router.post('/sessions', controller.createSession);

// Get specific session
router.get('/sessions/:sessionId', controller.getSessionById);

// Update session title
router.patch('/sessions/:sessionId', controller.updateSessionTitle);

// Delete session
router.delete('/sessions/:sessionId', controller.deleteSession);

module.exports = router;