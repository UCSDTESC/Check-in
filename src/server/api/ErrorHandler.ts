import { Logger } from '@Config/Logging';
import { Config } from '@Config/index';
import * as express from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: Error, request: express.Request, response: express.Response, next: (err?: any) => any) {
    Logger.error(error);
    return response.status(400).json({
      error: true,
      name: error.name,
      message: error.message,
      ...(Config.IsDev) && {stack: error.stack},
    });
  }
}
