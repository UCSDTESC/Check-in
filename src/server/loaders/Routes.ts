import { Config } from '@Config/index';
import * as express from 'express';
import { useExpressServer, useContainer } from 'routing-controllers';
import Container from 'typedi';

import { CustomErrorHandler } from '../api/ErrorHandler';
import Controllers from '../api/controllers';

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

    useContainer(Container);

    app = useExpressServer(app, {
      routePrefix: '/api',
      controllers: Controllers,
      middlewares: [
        CustomErrorHandler,
      ],
      defaultErrorHandler: false,
      classTransformer: false,
      defaults: {
        paramOptions: {
          required: true,
        },
      },
    });

    // React fallback
    app.get('*', (req, res) => {
      if (!res.headersSent) {
        return res.render('index');
      }
    });
  }
}
