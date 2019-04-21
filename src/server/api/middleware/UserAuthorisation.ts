import { TESCUser } from '@Shared/Types';
import * as express from 'express';
import * as passport from 'passport';
import { Middleware, ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';

export class UserAuthorisation implements ExpressMiddlewareInterface {
  authenticate = (callback?: (...args: any[]) => any) => passport.authenticate('userJwt', { session: false }, callback);

  use(req: express.Request, res: express.Response, next?: express.NextFunction): Promise<passport.Authenticator> {
    return this.authenticate((err, user: TESCUser, info) => {
      if (err || !user) {
        return next(new UnauthorizedError(info));
      }

      req.user = user;
      return next();
    })(req, res, next);
  }
}
