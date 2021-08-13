const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

const User = require('../models/user');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload.id, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        const reqUser = { _id: user._id, name: user.name, email: user.email };
        return done(null, reqUser);
      } else {
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
