const express = require('express');
const router = express.Router();

const controller = require('../controllers/reciept');
const catchAsync = require('../utils/catchAsync');

const {isLoggedIn} = require('../middleware');

router.use(isLoggedIn);

router.get('/get-reciept', controller.getReciept);

router.post('/analyseReciept', catchAsync(controller.analyseReciept));

module.exports = router;