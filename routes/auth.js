const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

const catchAsync = require('../utils/catchAsync');

const { loginAuthenticate, redirectIfLoggedIn, storeReturnTo, validateUser } = require('../middleware');

router.get('/', controller.home);

router.get('/register', redirectIfLoggedIn, controller.registerForm);

router.post('/register', redirectIfLoggedIn, catchAsync(controller.register));

router.get('/login', redirectIfLoggedIn, controller.loginForm);

router.get('/enter-email',  controller.enterEmail);

router.post('/send-reset-code', catchAsync(controller.sendResetCode));

router.get('/confirm-code', controller.confirmCodeForm);

router.post('/confirm-code', catchAsync(controller.confirmCode));

router.get('/reset-password', controller.resetPasswordForm);

router.post('/reset-password', catchAsync(controller.resetPassword));

router.post('/login', storeReturnTo, loginAuthenticate, controller.login);

router.post('/logout', controller.logout);

module.exports = router;