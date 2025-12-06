const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');
const User = require('../models/user');

router.get('/register', controller.registerForm);

router.post('/register', controller.register);

module.exports = router;
