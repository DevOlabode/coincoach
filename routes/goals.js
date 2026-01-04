const express = require('express');
const router = express.Router();
const controller = require('../controllers/goals');

const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.use(isLoggedIn);

router.get('/', catchAsync(controller.index));

router.get('/:id', catchAsync(controller.show));

router.post('/', catchAsync(controller.goals));

router.delete('/:id', catchAsync(controller.deleteGoal));

router.patch('/:id/status', catchAsync(controller.updateGoalStatus));

router.post('/:id/complete/:periodNumber',catchAsync(controller.completePeriod));

module.exports = router;
