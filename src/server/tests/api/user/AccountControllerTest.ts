import EventService from '@Services/EventService';
import TeamService from '@Services/TeamService';
import UserService from '@Services/UserService';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { Container } from 'typedi';
import { generateFakeAccountDocument, generateFakeEventDocument, generateFakeUserDocument } from '../../fake';
import { setIsNew } from '../../utils';
import { AccountModel } from '@Models/Account';
import { AccountController } from '../../../api/controllers/user/AccountController';
import { ErrorMessage } from '../../../utils/Errors';
import { Types } from 'mongoose';
import { EmailExistsRequest } from '@Shared/api/Requests';

describe('AccountController', () => {
  const dbConnection = new TestDatabaseConnection();
  const userService = Container.get(UserService);
  const eventService = Container.get(EventService);
  const teamService = Container.get(TeamService);

  const accountModel = Container.get<AccountModel>('AccountModel');

  let fakeAccount = generateFakeAccountDocument();
  let fakeEvent = generateFakeEventDocument();
  let fakeUser = generateFakeUserDocument({
    account: fakeAccount,
    event: fakeEvent
  });
  const accountController = new AccountController(eventService, userService);

  beforeAll(async () => await dbConnection.connect());

  afterEach(async () => {
    setIsNew(fakeAccount, true);
    setIsNew(fakeEvent, true);
    setIsNew(fakeUser, true);

    await dbConnection.clearDatabase()
  });

  describe('confirmEmail', () => {
    describe('for account that does not exist', () => {
      test('error is thrown', async () => {
        try {
          await accountController.confirmEmail(new Types.ObjectId().toHexString());
        } catch (error) {
          expect(error).toEqual(new Error(ErrorMessage.NO_USER_EXISTS()));
        }
      });
    });

    describe('for account that exists', () => {
      beforeEach(async () => {
        await fakeAccount.save();
      });

      test('sets account.confirmed to true', async () => {
        const res = await accountController.confirmEmail(fakeAccount._id);

        const account = await accountModel.findById(fakeAccount._id);

        expect(account.confirmed).toBeTruthy();
        expect(res.success).toBeTruthy();
      });
    });
  });

  describe('getAccountEvents', () => {
    describe('for account that does not exist', () => {
      test('error is thrown', async () => {
        try {
          await accountController.getAccountEvents(new Types.ObjectId().toHexString());
        } catch (error) {
          expect(error).toEqual(new Error(ErrorMessage.NO_USER_EXISTS()));
        }
      });
    });

    describe('for existing account', () => {
      beforeEach(async () => {
        await fakeEvent.save();
        await fakeAccount.save();
        await fakeUser.save();
      });

      test('return events for the given account', async () => {
        const events = await accountController.getAccountEvents(fakeAccount._id);

        expect(events.map(e => e.alias)).toEqual([fakeEvent.alias]);
      });
    });
  });

  describe('checkEmailExists', () => {
    describe('for email that does not exist', () => {
      test('returns false', async () => {
        const {exists} = await accountController.checkEmailExists({email: 'tesc@tesc.ucsd.edu'} as EmailExistsRequest);
        expect(exists).toBeFalsy();
      });
    });

    describe('for email that does exist', () => {

      beforeEach(async () => {
        await fakeAccount.save();
      });

      test('returns true', async () => {
        const {exists} = await accountController.checkEmailExists({email: fakeAccount.email} as EmailExistsRequest);
        expect(exists).toBeTruthy();
      });
    });
  });
});