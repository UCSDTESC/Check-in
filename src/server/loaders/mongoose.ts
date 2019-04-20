import express from 'express';
import mongoose from 'mongoose';

import { Config } from '../config';

import Loader from './loader';

export default class MongooseLoader extends Loader {
  public static async initialiseLoader(app: express.Application) {
    return mongoose.connect(Config.MongoDBURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
  }
}
