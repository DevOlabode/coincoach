const express = require('express');
const router = express.Router();

const controller = require('../controllers/user');
const { isLoggedIn } = require('../middleware');

router.use(isLoggedIn);

router.get('/edit-profile', controller.editProfileForm);

router.get('/:displayName', controller.userProfile);

router.delete('/:displayName/delete', controller.deleteAcct);

module.exports = router;