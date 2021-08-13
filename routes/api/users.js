const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../../controllers/api/users');

router.post('/login', usersController.login);
router.post('/signup', usersController.signup);
router.post('/profile', usersController.fetchProfile);
router.post('/profile/search', usersController.searchProfiles);

module.exports = router;
