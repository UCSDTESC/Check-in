import UserService from '@Services/UserService';
import EventService from '@Services/EventService';
import EmailService from '@Services/EmailService';
import TeamService from '@Services/TeamService';
import { AccountDocument } from '@Models/Account';
import { UserController } from '../../api/controllers/user/UserController';
import { BadRequestError } from 'routing-controllers';
import mockingoose from 'mockingoose';
import { Container } from 'typedi';
import * as path from 'path';
import { ErrorMessage } from '../../utils/Errors';
import { fakeEvent, fakeUser, fakeAccount, generateFakeApplication, generateFakeEventDocument, generateFakeEvent } from '../fake';
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
          await userController.get(fakeEvent, {} as AccountDocument);
        } catch (error) {
          expect(error).toEqual(new Error(ErrorMessage.USER_NOT_REGISTERED()));
        }
      });
    });

    describe('for user with application', () => {
      beforeAll(() => {
        userModel.toReturn(fakeUser, 'find');
      });

      test('returns application', async () => {
        const returnedUser = await userController.get(fakeEvent, fakeAccount);
      
        expect(returnedUser).toMatchObject(fakeUser);
      });
    });
  });

  describe('registerNewUser', () => {
    const fakeApplication = generateFakeApplication();
    describe('for non existent event', () => {
      beforeAll(() => {
        eventModel.toReturn(undefined, 'findOne');
      });

      afterAll(() => {
        eventModel.reset();
      });

      test('error is thrown', async () => {
        try {
          await userController.registerNewUser({} as Express.Multer.File, fakeApplication, {} as Request);
        } catch (error) {
          expect(error).toEqual(new BadRequestError(ErrorMessage.NO_ALIAS_EXISTS(undefined)));
        }
      });  
    });
          
    describe('for closed event', () => {
      beforeAll(() => {
        eventModel.toReturn(generateFakeEventDocument({
          closeTime: new Date(1995, 11, 17).toString()
        }), 'findOne');
      });

      afterAll(() => {
        eventModel.reset();
      })

      test('error is thrown', async () => {
        try {
          await userController.registerNewUser({} as Express.Multer.File, fakeApplication, {} as Request);
        } catch (error) {
          expect(error).toEqual(new BadRequestError(ErrorMessage.CANNOT_REGISTER()));
        }
      });
    });

    describe('for user with existing tesc.events account', () => {
      beforeAll(() => {
        accountModel.toReturn(fakeAccount, 'findOne');
        eventModel.toReturn(fakeEvent, 'findOne');
        userModel.toReturn(fakeUser, 'save');
      });

      describe('for user that has already applied to event', () => {
        beforeAll(() => {
          userModel.toReturn(fakeUser, 'findOne');
        })

        afterAll(() => {
          userModel.reset();
        });

        test('error is thrown', async () => {
          try {
            await userController.registerNewUser({} as Express.Multer.File, fakeApplication, {} as Request);
          } catch (error) {
            expect(error).toEqual(new BadRequestError(ErrorMessage.CANNOT_REGISTER()));
          }         
        });
      });
    });

    describe('teams', () => {
      describe('for event without team option set', () => {
        beforeEach(() => {
          userModel.toReturn(fakeUser, 'save');
          eventModel.toReturn(generateFakeEventDocument({
            closeTime: new Date(2200, 12, 30).toString(), 
            options: {
              ...generateFakeEvent().options,
              allowTeammates: false
            }
          }), 'findOne');
        });
  
        test('no team service methods are called', async () => {
          const getTeamByCodeSpy = jest.spyOn(teamService, 'getTeamByCode');
          const createNewTeamSpy = jest.spyOn(teamService, 'createNewTeam');
  
          await userController.registerNewUser({
            path: path.join(__dirname, '../test-resume.pdf')
          } as Express.Multer.File, fakeApplication, {} as Request);
  
          expect(getTeamByCodeSpy).toHaveBeenCalledTimes(0);
          expect(createNewTeamSpy).toHaveBeenCalledTimes(0);
  
          getTeamByCodeSpy.mockRestore();
          createNewTeamSpy.mockRestore();
        });
      });

      describe('for event with team option set', () => {
        beforeEach(() => {
          userModel.toReturn(fakeUser, 'save');
          eventModel.toReturn(generateFakeEventDocument({
            closeTime: new Date(2200, 12, 30).toString(), 
            options: {
              ...generateFakeEvent().options,
              allowTeammates: true
            }
          }), 'findOne');
        });

        test('for user creating a new team', () => {
           
        });
      });
    });
  });
});