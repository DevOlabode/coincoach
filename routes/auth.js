const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');

const catchAsync = require('../utils/catchAsync');

const { loginAuthenticate, redirectIfLoggedIn, storeReturnTo, validateUser } = require('../middleware');

router.get('/register', redirectIfLoggedIn, controller.registerForm);

router.post('/register', validateUser, redirectIfLoggedIn, catchAsync(controller.register));

router.get('/login', redirectIfLoggedIn, controller.loginForm);

router.post('/login', validateUser, storeReturnTo, loginAuthenticate, controller.login);

router.get('/logout', controller.logout);

module.exports = router;