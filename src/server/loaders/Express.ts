import * as bodyParser from 'body-parser';
import compression from 'compression';
import * as express from 'express';
import * as path from 'path';

import Loader from './Loader';

export default class ExpressLoader extends Loader {
  public static async initialiseLoader(app: express.Application) {
    app.use(compression());
    app.use(bodyParser.json({type: 'application/json', limit: '50mb'}));
    app.use(bodyParser.urlencoded({
      extended: true,
      limit: '50mb',
      parameterLimit: 3000,
    }));

    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'pug');

    app.use(express.static(path.join(__dirname, '../../assets/public')));
  }
}
