const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');
const User = require('../models/user');

const passport = require('passport');

const { loginAuthenticate, redirectIfLoggedIn, storeReturnTo } = require('../middleware');

router.get('/register', controller.registerForm);

router.post('/register', controller.register);

router.get('/login', controller.loginForm);

module.exports = router;