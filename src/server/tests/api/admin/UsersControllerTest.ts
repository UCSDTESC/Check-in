import { UsersController } from '../../../api/controllers/admin/UsersController';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { Container } from 'typedi';
import UserService from '@Services/UserService';
import EventService from '@Services/EventService';
import { generateFakeAdminDocument, generateFakeEventDocument, generateFakeUser, generateFakeUserDocument, generateFakeAccountDocument } from '../../fake';
import { ErrorMessage } from '../../../utils/Errors';
import { UserModel, UserDocument } from '@Models/User';
import { AccountDocument } from '@Models/Account';
import { UserStatus } from '@Shared/UserStatus';

describe('UsersController', () => {
  const dbConnection = new TestDatabaseConnection();
  const eventService = Container.get(EventService);
  const userService = Container.get(UserService);

  const userModel = Container.get<UserModel>('UserModel');

  const usersController = new UsersController(userService, eventService);

  beforeAll(async () => await dbConnection.connect());

  afterEach(async () => await dbConnection.clearDatabase());

  afterAll(async () => await dbConnection.closeDatabase());

  describe('updateUser', () => {
    describe('for admin that is not an organizer of the event', () => {
      const admin = generateFakeAdminDocument();
      const event = generateFakeEventDocument();

      beforeEach(async () => {
        await admin.save();
        await event.save();
      })

      test('does not allow update', async () => {
        try {
          // updateUser should not need any of the other fields in the second arg.
          await usersController.updateUser(admin, {event} as any);
        } catch(e) {
          expect(e).toEqual(new Error(ErrorMessage.NOT_ORGANISER()));
        }
      });
    })

    describe('for admin that is the organizer of the event', () => {
      const admin = generateFakeAdminDocument();
      const event = generateFakeEventDocument({
        organisers: [admin]
      });
      const account = generateFakeAccountDocument();
      const user = generateFakeUser({
        event: event,
        account
      });

      let savedUser: UserDocument;

      beforeEach(async () => {
        await admin.save();
        await event.save();
        savedUser = await generateFakeUserDocument(user).save();
      });

      test('updates user', async () => {
        await usersController.updateUser(admin, {
          ...savedUser.toObject(),
          firstName: 'new first name'
        });

        const updatedUser = await userModel.findById(savedUser._id);
        expect(updatedUser.firstName).toBe('new first name');
      })
    })
  });

  describe('bulkUpdate', () => {
    const accounts = new Array<AccountDocument>(4);
    const users = new Array<UserDocument>(4);

    const admin = generateFakeAdminDocument();
    const event = generateFakeEventDocument({
      organisers: [admin]
    });

    beforeEach(async () => {
      for (let i = 0; i < 4; i++) {
        const account = generateFakeAccountDocument({
          email: `fake-${i}@tesc.ucsd.edu`
        });
        const user = generateFakeUserDocument({
          account, 
          event
        });

        await account.save();
        await user.save();

        accounts[i] = account;
        users[i] = user;
      }
    });

    test('updates users', async () => {
      await usersController.bulkUpdate({
        users: users.slice(0, 3).map<string>(u => u._id),
        status: UserStatus.Rejected
      });

      const updatedStatuses = new Array<string>(4);
      for (let [i, user] of users.entries()) {
        const updated = await userModel.findById(user._id);
        updatedStatuses[i] = updated.status;
      }

      expect(updatedStatuses).toEqual([UserStatus.Rejected, UserStatus.Rejected, UserStatus.Rejected, UserStatus.NoStatus])
    })
  })
});
