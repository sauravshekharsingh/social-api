const express = require('express');
const router = express.Router();
const passport = require('passport');

const likesController = require('../../controllers/api/likes');

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  likesController.createLike
);

router.post(
  '/unlike',
  passport.authenticate('jwt', { session: false }),
  likesController.unlike
);

module.exports = router;
