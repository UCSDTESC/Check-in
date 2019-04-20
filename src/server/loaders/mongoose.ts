import { Config } from '@Config/index';
import * as express from 'express';
import * as mongoose from 'mongoose';

import Loader from './Loader';

export default class MongooseLoader extends Loader {
  public static async initialiseLoader(app: express.Application) {
    return mongoose.connect(Config.MongoDBURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  }
}
