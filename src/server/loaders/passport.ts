import { PassportStrategy } from '@Config/Passport';
import * as express from 'express';
import * as passport from 'passport';
import { Container } from 'typedi';

import Loader from './Loader';

export default class PassportLoader extends Loader {
  public static async initialiseLoader(app: express.Application) {
    app.use(passport.initialize());

    const strategies = Container.get(PassportStrategy);

    passport.use('adminJwt', strategies.getJWTAdminLogin());
    passport.use('admin', strategies.getAdminLogin());

    passport.use('userJwt', strategies.getJWTUserLogin());
    passport.use('user', strategies.getUserLogin());
  }
}
