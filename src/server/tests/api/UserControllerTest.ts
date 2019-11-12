import UserService from '@Services/UserService';
import EventService from '@Services/EventService';
import EmailService from '@Services/EmailService';
import TeamService from '@Services/TeamService';
import { UserController } from '../../api/controllers/user/UserController';
import mockingoose from 'mockingoose';
import { Container } from 'typedi';
import { AccountDocument } from '@Models/Account';
import { RegisterUserRequest } from '@Shared/api/Requests';
import { ErrorMessage } from '../../utils/Errors';
import { populatedEvent, populatedUser, populatedAccount } from '../fake';
import { Request } from 'express-serve-static-core';

describe('UserController', () => {
  const userService = Container.get(UserService);
  const eventService = Container.get(EventService);
  const emailService = Container.get(EmailService);
  const teamService = Container.get(TeamService);

  const userModel = mockingoose(Container.get('UserModel'));
  const eventModel = mockingoose(Container.get('EventModel'));
  const accountModel = mockingoose(Container.get('AccountModel'));

  const userController = new UserController(
    eventService, 
    emailService,
    teamService,
    userService
  );

  describe('get', () => {
    afterAll(() => {
      mockingoose.resetAll()
    });

    describe('for user with no application', () => {
      beforeAll(() => {
        userModel.toReturn(null, 'find');
      });

      test('error is thrown', async () => {
        try {
          await userController.get(populatedEvent, {} as AccountDocument);
        } catch (error) {

          expect(error).toEqual(new Error(ErrorMessage.USER_NOT_REGISTERED()));
        }
      });
    });

    describe('for user with application', () => {
      beforeAll(() => {
        userModel.toReturn(populatedUser, 'find');
      });

      test('returns application', async () => {
        const returnedUser = await userController.get(populatedEvent, populatedAccount);
      
        expect(returnedUser).toMatchObject(populatedUser);
      });
    });
  });

  describe('registerNewUser', () => {
    describe('for non existent event', () => {
      beforeAll(() => {
        eventModel.toReturn(null, 'find');
      });

      afterAll(() => {
        eventModel.reset();
      });

      test('error is thrown', async () => {
        try {
          await userController.registerNewUser({} as Express.Multer.File, {} as RegisterUserRequest, {} as Request);
        } catch (error) {
          expect(error).toEqual(new Error(ErrorMessage.NO_ALIAS_EXISTS(null)));
        }
      });  
    });
          
    describe('for closed event', () => {
      beforeAll(() => {
        eventModel.toReturn({...populatedEvent, closeDate: new Date(1995, 11, 17).toString()}, 'find');
      });

      afterAll(() => {
        eventModel.reset();
      })

      test('error is thrown', async () => {
        try {
          await userController.registerNewUser({} as Express.Multer.File, {} as RegisterUserRequest, {} as Request);
        } catch (error) {
          expect(error).toEqual(new Error(ErrorMessage.CANNOT_REGISTER()));
        }
      });
    }); 

    describe('for user with existing tesc.events account', () => {
      beforeAll(() => {
        accountModel.toReturn(populatedAccount, 'find');
      });

      describe('for user that has already applied to event', () => {
        beforeAll(() => {
          userModel.toReturn(populatedUser, 'findOne');
          eventModel.toReturn(populatedEvent, 'find');
        })

        afterAll(() => {
          userModel.reset();
        });

        test('error is thrown', async () => {
          try {
            await userController.registerNewUser({} as Express.Multer.File, {} as RegisterUserRequest, {} as Request);
          } catch (error) {
            expect(error).toEqual(new Error(ErrorMessage.CANNOT_REGISTER()));
          }         
        });
      })
    });
  });
});