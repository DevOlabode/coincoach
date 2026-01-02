const express = require('express');
const router = express.Router();

const controller = require('../controllers/user');
const { isLoggedIn, redirectIfCompletedProfile } = require('../middleware');

const catchAsync = require('../utils/catchAsync');

router.use(isLoggedIn);

router.get('/edit-profile', catchAsync(controller.editProfileForm));

router.post('/edit-profile', catchAsync(controller.editProfile));

router.get('/complete-profile', redirectIfCompletedProfile, catchAsync(controller.completeProfileForm));

router.post('/complete-profile', catchAsync(controller.completeProfile));

router.get('/edit-account', catchAsync(controller.editAccountForm));

router.post('/edit-account', catchAsync(controller.editAccount));

router.get('/profile', catchAsync(controller.userProfile));

router.delete('/delete', catchAsync(controller.deleteAcct));

module.exports = router;