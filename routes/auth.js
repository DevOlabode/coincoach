const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

const catchAsync = require('../utils/catchAsync');

const { loginAuthenticate, redirectIfLoggedIn, storeReturnTo } = require('../middleware');

router.get('/register', redirectIfLoggedIn, controller.registerForm);

router.post('/register', redirectIfLoggedIn, catchAsync(controller.register));

router.get('/login', redirectIfLoggedIn, controller.loginForm);

router.post('/login', storeReturnTo, loginAuthenticate, controller.login);

router.get('/forgotten-password', controller.enterEmail);

router.post('/forgotten-password', catchAsync(controller.confirmEmail));

router.get('/reset-password',  controller.resetCodeForm)

module.exports = router;