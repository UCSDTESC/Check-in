import express from 'express';

import { Logger } from '../config/logging';

import ExpressLoader from './express';
import MongooseLoader from './mongoose';
import PassportLoader from './passport';

export default class ApplicationLoader {
  public static async InitialiseLoaders(app: express.Application) {
    const mongoose = await MongooseLoader.initialiseLoader(app);
    Logger.info('Connected to Mongoose');

    await ExpressLoader.initialiseLoader(app);
    Logger.info('Initialised Express');
    await PassportLoader.initialiseLoader(app);
    Logger.info('Initialised Passport');

    return {mongoose};
  }
}
