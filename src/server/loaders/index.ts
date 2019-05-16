import { Logger } from '@Config/Logging';
import * as express from 'express';

import ExpressLoader from './Express';
import MongooseLoader from './Mongoose';
import PassportLoader from './Passport';
import RoutesLoader from './Routes';
import SwaggerLoader from './Swagger';

export default class ApplicationLoader {
  public static async InitialiseLoaders(app: express.Application) {
    const mongoose = await MongooseLoader.initialiseLoader(app);
    Logger.info('Connected to Mongoose');

    await ExpressLoader.initialiseLoader(app);
    Logger.info('Initialised Express');
    await PassportLoader.initialiseLoader(app);
    Logger.info('Initialised Passport');

    await SwaggerLoader.initialiseLoader(app);
    Logger.info('Initialised API Docs');
    await RoutesLoader.initialiseLoader(app);
    Logger.info('Initialised Routes');

    return {mongoose};
  }
}
