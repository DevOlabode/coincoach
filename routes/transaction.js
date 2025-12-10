const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction');

const {isLoggedIn} = require('../middleware');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/new', controller.newTransactionForm);

router.post('/', catchAsync(controller.createTransaction));

router.get('/', catchAsync(controller.getTransactions));

router.get('/bulk-upload', controller.bulkUploadForm);

router.post('/bulk-upload', upload.single('csvFile'), catchAsync(controller.bulkUpload));

router.get('/:id', catchAsync(controller.getTransactionById));

router.delete('/:id', catchAsync(controller.deleteTransaction));

router.get('/:id/edit', catchAsync(controller.editTransactionsForm));

router.patch('/:id', catchAsync(controller.updateTransaction));

module.exports = router;