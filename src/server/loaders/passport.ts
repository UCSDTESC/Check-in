import express from 'express';
import passport from 'passport';

import * as Strategies from '../config/passport';

import Loader from './loader';

export default class PassportLoader extends Loader {
  public static async initialiseLoader(app: express.Application) {
    app.use(passport.initialize());

    passport.use('adminJwt', Strategies.jwtAdminLogin);
    passport.use('admin', Strategies.adminLogin);

    passport.use('userJwt', Strategies.jwtUserLogin);
    passport.use('user', Strategies.userLogin);
  }
}
