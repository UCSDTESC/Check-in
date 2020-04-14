import { StatisticsController } from '../../../api/controllers/admin/StatisticsController';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { Container } from 'typedi';
import EventService from '@Services/EventService';
import { generateFakeAdminDocument, generateFakeEventDocument, generateFakeUser, generateFakeUserDocument, generateFakeAccountDocument } from '../../fake';
import { ErrorMessage } from '../../../utils/Errors';
import { UserModel, UserDocument } from '@Models/User';
import StatisticsService from '@Services/StatisticsService';


describe('StatisticsController', () => {
  const dbConnection = new TestDatabaseConnection();
  const eventService = Container.get(EventService);
  const statsService = Container.get(StatisticsService);

  const userModel = Container.get<UserModel>('UserModel');

  const statsController = new StatisticsController(eventService, statsService);

  beforeAll(async () => await dbConnection.connect());

  afterEach(async () => await dbConnection.clearDatabase());

  afterAll(async () => await dbConnection.closeDatabase());

  describe('get', () => {
    describe('for admin that is not an organizer of the event', () => {
      const admin = generateFakeAdminDocument();
      const event = generateFakeEventDocument();

      beforeEach(async () => {
        await admin.save();
        await event.save();
      })

      test('does not allow admin to read', async () => {
        try {
          await statsController.get(admin, event);
        } catch(e) {
          expect(e).toEqual(new Error(ErrorMessage.NOT_ORGANISER()));
        }
      });
    });

    describe('for admin that is the organizer of the event', () => {
      const admin = generateFakeAdminDocument();
      const event = generateFakeEventDocument({
        organisers: [admin]
      });
      
      beforeEach(async () => {
        await admin.save();
        await event.save();
      });

      /**
       * This is a very shallow test and does not test much of the aggregation
       * logic within StatisticsController. TODO: Get better code coverage
       * within StatisticsController.
       */
      test('returns statistics', async () => {
        const stats = await statsController.get(admin, event);

        expect(stats).not.toBeNull();
      })
    });
  });

});
