import { AccountModel } from '@Models/Account';
import { AdminModel } from '@Models/Admin';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Service } from 'typedi';

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

@Service()
export class PassportStrategy {
  constructor(
    private AdminModel: AdminModel,
    private AccountModel: AccountModel,
  ) {}

  public getAdminLogin() {
    return new LocalStrategy(localAdminOptions,
      (username, password, done) => {
        this.AdminModel.findOne({username: {$regex : new RegExp(`^${username}$`, 'i')}},
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
  }

  public getJWTAdminLogin() {
    return new JwtStrategy(jwtOptions, (payload, done) => {
      this.AdminModel.findById(payload._id, (err, user) => {
        if (err || user.isDeleted()) {
          return done(err, false);
        }

        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    });
  }

  public getUserLogin() {
    return new LocalStrategy(localUserOptions,
      (email, password, done) => {
        this.AccountModel.findOne({email: {$regex : new RegExp(`^${email}$`, 'i')}},
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
  }

  public getJWTUserLogin() {
    return new JwtStrategy(jwtOptions, (payload, done) => {
      this.AccountModel.findById(payload._id, (err, account) => {
        if (err || account === null || account.isDeleted()) {
          return done(err, false);
        }

        if (account) {
          return done(null, account);
        }
        return done(null, false);
      });
    });
  }
}
