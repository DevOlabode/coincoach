const express = require('express');
const router = express.Router();

const controller = require('../controllers/user');
const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

router.get('/:displayName', controller.userProfile);

module.exports = router;