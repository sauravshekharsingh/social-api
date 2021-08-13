const express = require('express');
const router = express.Router();
const passport = require('passport');

const friendsController = require('../../controllers/api/friends');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  friendsController.fetchFriends
);

router.post(
  '/add',
  passport.authenticate('jwt', { session: false }),
  friendsController.addFriend
);

router.post(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  friendsController.removeFriend
);

module.exports = router;
