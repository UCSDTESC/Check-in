const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');

require('dotenv').config();

const localOptions = {
  usernameField: 'username'
};

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  // Telling Passport where to find the secret
  secretOrKey: process.env.SESSION_SECRET
};

const returnMessages = {
  INCORRECT_LOGIN: 'Your login details could not be verified. Please try again.',
  NOT_CONFIRMED: 'You have not yet confirmed this account'
};

const adminLogin = new LocalStrategy(localOptions,
function(username, password, done) {
  Admin.findOne({username: {$regex : new RegExp(`^${username}$`, 'i')}},
  function(err, admin) {
    if (err) {
      return done(err);
    }
    if (!admin || admin.deleted) {
      return done(null, false, {error: returnMessages.INCORRECT_LOGIN});
    }

    admin.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false, {error: returnMessages.INCORRECT_LOGIN});
      }

      return done(null, admin);
    });
  });
});

const jwtAdminLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  Admin.findById(payload._id, function(err, user) {
    if (err || user.deleted) {
      return done(err, false);
    }

    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
});

passport.use('adminJwt', jwtAdminLogin);
passport.use('admin', adminLogin);
