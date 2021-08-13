const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../../controllers/api/posts');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  postsController.fetchPosts
);

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  postsController.createPost
);

router.post(
  '/delete',
  passport.authenticate('jwt', { session: false }),
  postsController.deletePost
);

module.exports = router;
