const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction');

const {isLoggedIn} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const {validateTransaction} = require('../middleware');

router.use(isLoggedIn);

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.get('/new', controller.newTransactionForm);

router.post('/', validateTransaction, catchAsync(controller.createTransaction));

router.get('/', catchAsync(controller.getTransactions));

router.get('/bulk-upload', controller.bulkUploadForm);

router.post('/bulk-upload', validateTransaction, upload.single('csvFile'), catchAsync(controller.bulkUpload));

router.get('/bulk-json', controller.bulkUploadJSONFrontend);

router.get('/:id', catchAsync(controller.getTransactionById));

router.get('/:id/edit', catchAsync(controller.editTransactionsForm));

router.patch('/:id', validateTransaction, catchAsync(controller.updateTransaction));

router.post('/bulk-json', express.json(), catchAsync(controller.bulkUploadJSON));

router.delete('/:id', catchAsync(controller.deleteTransaction));

module.exports = router;