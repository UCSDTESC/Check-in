import { Admin } from '@Shared/Types';
import * as express from 'express';
import * as passport from 'passport';
import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';

export class AdminAuthorisation implements ExpressMiddlewareInterface {
  authenticate = (callback?: (...args: any[]) => any) =>
    passport.authenticate('adminJwt', { session: false }, callback);

  use(req: express.Request, res: express.Response, next?: express.NextFunction): Promise<passport.Authenticator> {
    return this.authenticate((err, user: Admin, info) => {
      if (err || !user) {
        return next(info);
      }

      req.user = user;
      return next();
    })(req, res, next);
  }
}
