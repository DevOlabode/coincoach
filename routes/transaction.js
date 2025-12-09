const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction');

const {isLoggedIn} = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.get('/new', controller.newTransactionForm);

router.post('/', catchAsync(controller.createTransaction));

router.get('/', catchAsync(controller.getTransactions));

module.exports = router;