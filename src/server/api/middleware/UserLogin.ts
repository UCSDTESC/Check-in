import { Logger } from '@Config/Logging';
import { AccountDocument } from '@Models/Account';
import * as express from 'express';
import * as passport from 'passport';
import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';

export class UserLogin implements ExpressMiddlewareInterface {
  authenticate = (callback?: (...args: any[]) => any) =>
    passport.authenticate('user', { session: false }, callback);

  use(req: express.Request, res: express.Response, next?: express.NextFunction): Promise<passport.Authenticator> {
    return this.authenticate((err, user: AccountDocument, info) => {
      if (err) {
        return next(err);
      }
      if (info) {
        return next(new UnauthorizedError(info.message));
      }

      req.user = user;
      return next();
    })(req, res, next);
  }
}
