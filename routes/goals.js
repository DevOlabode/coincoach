const express = require('express');
const router = express.Router();
const controller = require('../controllers/goals');

const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

router.get('/',controller.index);

module.exports = router