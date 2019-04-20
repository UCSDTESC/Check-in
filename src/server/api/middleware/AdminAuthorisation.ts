import * as express from 'express';
import * as passport from 'passport';
import { Middleware, ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';

@Middleware({ type: 'before' })
export class AdminAuthorisationMiddleware implements ExpressMiddlewareInterface {
  authenticate = (callback?: (...args: any[]) => any) =>
    passport.authenticate('adminJwt', { session: false }, callback);

  use(req: express.Request, res: express.Response, next?: express.NextFunction): Promise<passport.Authenticator> {
    return this.authenticate((err, user, info) => {
      if (err || !user) {
        return next(new UnauthorizedError(info));
      }

      req.user = user;
      return next();
    })(req, res, next);
  }
}
