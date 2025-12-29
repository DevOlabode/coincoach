const express = require('express');
const router = express.Router();

const controller = require('../controllers/conversion');

router.get('/', controller.index)

module.exports = router;