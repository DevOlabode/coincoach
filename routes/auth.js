const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

const catchAsync = require('../utils/catchAsync');

const { loginAuthenticate, redirectIfLoggedIn, storeReturnTo } = require('../middleware');

router.get('/register', controller.registerForm);

router.post('/register', redirectIfLoggedIn, catchAsync(controller.register));

router.get('/login', controller.loginForm);

router.post('/login', storeReturnTo, loginAuthenticate, catchAsync(controller.login));

module.exports = router;