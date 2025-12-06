const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth');
const User = require('../models/user');

module.exports = router;