import { Config } from '@Config/index';
import { RegisterModels } from '@Models/index';
import * as express from 'express';
import * as mongoose from 'mongoose';
import { Container } from 'typedi';

import Loader from './Loader';

export default class MongooseLoader extends Loader {
  public static async initialiseLoader(app: express.Application) {
    return mongoose.connect(Config.MongoDBURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then((mongoose) => {
      Container.set('Mongoose', mongoose);
      
      RegisterModels();

      return mongoose;
    });
  }
}
