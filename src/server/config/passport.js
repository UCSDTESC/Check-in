const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');
const Account = mongoose.model('Account');

require('dotenv').config();

const localAdminOptions = {
  usernameField: 'username'
};

const localUserOptions = {
  usernameField: 'email'
};

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  // Telling Passport where to find the secret
  secretOrKey: process.env.SESSION_SECRET
};

const returnMessages = {
  INCORRECT_LOGIN:
    'Your login details could not be verified. Please try again.',
  NOT_CONFIRMED: 'You have not yet confirmed this account'
};

const adminLogin = new LocalStrategy(localAdminOptions,
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

const userLogin = new LocalStrategy(localUserOptions,
  function(email, password, done) {
    Account.findOne({email: {$regex : new RegExp(`^${email}$`, 'i')}},
      function(err, account) {
        if (err) {
          return done(err);
        }
        if (!account || account.deleted) {
          return done(null, false, {message: returnMessages.INCORRECT_LOGIN});
        }

        account.comparePassword(password, function(err, isMatch) {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, {error: returnMessages.INCORRECT_LOGIN});
          }

          return done(null, account);
        });
      });
  });

const jwtUserLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  Account.findById(payload._id, function(err, account) {
    if (err || account === null || account.deleted) {
      return done(err, false);
    }

    if (account) {
      return done(null, account);
    }
    return done(null, false);
  });
});

passport.use('adminJwt', jwtAdminLogin);
passport.use('admin', adminLogin);

passport.use('userJwt', jwtUserLogin);
passport.use('user', userLogin);
