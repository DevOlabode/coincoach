const express = require('express');
const router = express.Router();
const controller = require('../controllers/export');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.use(isLoggedIn);

// Export to Excel
router.get('/excel', catchAsync(controller.exportToExcel));

// Export to CSV (for Google Sheets)
router.get('/csv', catchAsync(controller.exportToCSV));

// Export for Google Sheets (same as CSV)
router.get('/google-sheets', catchAsync(controller.exportForGoogleSheets));

module.exports = router;