import { AuthController } from '../../../api/controllers/user/AuthController';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { Container } from 'typedi';
import UserService from '@Services/UserService';
import EmailService from '@Services/EmailService';

describe('AuthController', () => {
  const dbConnection = new TestDatabaseConnection();
  const emailService = Container.get(EmailService);
  const userService = Container.get(UserService);

  const authController = new AuthController(emailService, userService);

  beforeAll(async () => await dbConnection.connect());

  afterAll(async () => await dbConnection.closeDatabase());

  test.skip('TODO: AuthController Tests', () => {});
});
