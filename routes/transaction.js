const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction');

router.get('/new', controller.newTransactionForm);

module.exports = router;