import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Container } from 'typedi';
import { TeamModel } from '@Models/Team';
import { EventModel } from '@Models/Event';
import { AccountModel } from '@Models/Account';
import { AccountResetModel } from '@Models/AccountReset';
import { UserModel } from '@Models/User';

class TestDatabaseConnection {
  mongod: MongoMemoryServer;
  constructor() {
    if (!Container.has(MongoMemoryServer)) {
      Container.set(MongoMemoryServer, new MongoMemoryServer());
    }
    this.mongod = Container.get(MongoMemoryServer);
  }

  public async connect() {
    const uri = await this.mongod.getConnectionString();

    const mongooseOpts = {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    };

    mongoose.connection.on('error', (e) => {
      if (e.message.code === 'ETIMEDOUT') {
        console.log(e);
        mongoose.connect(uri, mongooseOpts);
      }
      console.log(e);
    });
  
    mongoose.connection.once('open', () => {
      console.log(`MongoDB successfully connected to ${uri}`);
    });

    await mongoose.connect(uri, mongooseOpts);
  }

  public async closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await this.mongod.stop();
  }

  public async clearDatabase() {
    const collections: mongoose.Model<mongoose.Document, {}>[] = [
      Container.get<TeamModel>('TeamModel'),
      Container.get<EventModel>('EventModel'),
      Container.get<AccountModel>('AccountModel'),
      Container.get<AccountResetModel>('AccountResetModel'),
      Container.get<UserModel>('UserModel')
    ]

    for (const model of collections) {
      await model.deleteMany({})
    }
  }

  public async clearUserModel() {
    await Container.get<UserModel>('UserModel').deleteMany({});
  }
}

export default TestDatabaseConnection;