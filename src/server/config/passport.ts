import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import { AccountModel } from '../models/account';
import { AdminModel } from '../models/admin';

import { Config } from '.';

const localAdminOptions = {
  usernameField: 'username',
};

const localUserOptions = {
  usernameField: 'email',
};

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  // Telling Passport where to find the secret
  secretOrKey: Config.SessionSecret,
};

const returnMessages = {
  INCORRECT_LOGIN:
    'Your login details could not be verified. Please try again.',
  NOT_CONFIRMED: 'You have not yet confirmed this account',
};

export const adminLogin = new LocalStrategy(localAdminOptions,
  (username, password, done) => {
    AdminModel.findOne({username: {$regex : new RegExp(`^${username}$`, 'i')}},
      (err, admin) => {
        if (err) {
          return done(err);
        }
        if (!admin || admin.isDeleted()) {
          return done(null, false, {message: returnMessages.INCORRECT_LOGIN});
        }

        admin.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, {message: returnMessages.INCORRECT_LOGIN});
          }

          return done(null, admin);
        });
      });
  });

export const jwtAdminLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  AdminModel.findById(payload._id, (err, user) => {
    if (err || user.isDeleted()) {
      return done(err, false);
    }

    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
});

export const userLogin = new LocalStrategy(localUserOptions,
  (email, password, done) => {
    AccountModel.findOne({email: {$regex : new RegExp(`^${email}$`, 'i')}},
      (err, account) => {
        if (err) {
          return done(err);
        }
        if (!account || account.isDeleted()) {
          return done(null, false, {message: returnMessages.INCORRECT_LOGIN});
        }

        account.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, {message: returnMessages.INCORRECT_LOGIN});
          }

          return done(null, account);
        });
      });
  });

export const jwtUserLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  AccountModel.findById(payload._id, (err, account) => {
    if (err || account === null || account.isDeleted()) {
      return done(err, false);
    }

    if (account) {
      return done(null, account);
    }
    return done(null, false);
  });
});
