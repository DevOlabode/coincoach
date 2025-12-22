const express = require('express');
const router = express.Router();

const controller = require('../controllers/insights');

const {isLogggedIn, isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

router.get('/', controller.allInsights);

module.exports = router;