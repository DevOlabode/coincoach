const express = require('express');
const router = express.Router();

const controller = require('../controllers/insights')

router.get('/all', controller.allInsights)

module.exports = router;