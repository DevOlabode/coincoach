const express = require('express');
const router = express.Router();
const controller = require('../controllers/bill');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.use(isLoggedIn);

// Bill dashboard - shows all predictions
router.get('/bills', catchAsync(controller.billDashboard));

// Generate new predictions
router.post('/bills/generate', catchAsync(controller.generatePredictions));

// Get pending notifications (for API/AJAX)
router.get('/bills/notifications', catchAsync(controller.getNotifications));

// Dismiss a prediction notification
router.post('/bills/:id/dismiss', catchAsync(controller.dismissPrediction));

module.exports = router;