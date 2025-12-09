const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction');

const {isLoggedIn} = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.get('/new', controller.newTransactionForm);

router.post('/', catchAsync(controller.createTransaction));

router.get('/', catchAsync(controller.getTransactions));

router.get('/:id', catchAsync(controller.getTransactionById));

router.delete('/:id', catchAsync(controller.deleteTransaction));

router.get('/:id/edit', catchAsync(controller.editTransactionsForm));

module.exports = router;