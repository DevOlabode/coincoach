const express = require('express');
const router = express.Router();

const controller = require('../controllers/conversion');

router.get('/', controller.index);

// routes/currency.js
router.post('/', controller.convert);

module.exports = router;