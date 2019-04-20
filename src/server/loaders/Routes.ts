import { Config } from '@Config/index';
import * as express from 'express';
import { useExpressServer } from 'routing-controllers';

import Loader from './Loader';

export default class RoutesLoader extends Loader {
  public static async initialiseLoader(app: express.Application) {

    // Development Hot-Middleware
    if (Config.NodeEnv === 'development') {
      const webpack = require('webpack');
      const webpackConfig = require('../../../webpack.config.js');

      const compiler = webpack(webpackConfig);
      app.use(require('webpack-dev-middleware')(compiler, {
        hot: false,
        publicPath: webpackConfig.output.publicPath,
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false,
        },
        watchOptions: {
          poll: true,
        },
      }));

      app.use(require('webpack-hot-middleware')(compiler, {
        publicPath: '/',
      }));
    }

    useExpressServer(app, {
      routePrefix: '/api',
      controllers: [__dirname + '../api/controllers/*.js'],
      middlewares: [__dirname + '../api/middleware/*.js'],
      classTransformer: true,
    });

    // React fallback
    app.get('*', (req, res) => {
      return res.render('index');
    });
  }
}
