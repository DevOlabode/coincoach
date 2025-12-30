const express = require('express');
const router = express.Router();

const controller = require('../controllers/insights');

const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

router.get('/', controller.allInsights);
router.get('/generate', controller.generateInsights);
router.get('/download-pdf', controller.downloadPDF);

module.exports = router;