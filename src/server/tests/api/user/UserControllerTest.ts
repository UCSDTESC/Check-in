import UserService from '@Services/UserService';
import EventService from '@Services/EventService';
import EmailService from '@Services/EmailService';
import TeamService from '@Services/TeamService';
import { AccountModel } from '@Models/Account';
import { UserController } from '../../../api/controllers/user/UserController';
import { Container } from 'typedi';
import { ErrorMessage } from '../../../utils/Errors';
import { generateFakeApplication, generateFakeEventDocument, generateFakeEvent, generateFakeAccountDocument, generateFakeUserDocument, generateFakeTeamDocument } from '../../fake';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { EventModel } from '@Models/Event';
import { UserModel } from '@Models/User';
import { BadRequestError } from 'routing-controllers';
import { Request } from 'express-serve-static-core';
import { TeamModel } from '@Models/Team';
import * as path from 'path';
import {setIsNew} from '../../utils';

describe('UserController', () => {

  const dbConnection = new TestDatabaseConnection();
  const userService = Container.get(UserService);
  const eventService = Container.get(EventService);
  const emailService = Container.get(EmailService);
  const teamService = Container.get(TeamService);

  const userModel = Container.get<UserModel>('UserModel');
  const eventModel = Container.get<EventModel>('EventModel');
  const accountModel = Container.get<AccountModel>('AccountModel');
  const teamModel = Container.get<TeamModel>('TeamModel');

  let fakeAccount = generateFakeAccountDocument();
  let fakeEvent = generateFakeEventDocument({
    closeTime: new Date(
      new Date().getTime()+(5*24*60*60*1000)).toString()
  });
  let fakeUser = generateFakeUserDocument({
    account: fakeAccount.toObject(),
    event: fakeEvent.toObject()
  });

  beforeAll(async () => await dbConnection.connect());

  afterEach(async () => {
    setIsNew(fakeAccount, true);
    setIsNew(fakeEvent, true);
    setIsNew(fakeUser, true);

    await dbConnection.clearDatabase()
  });

  afterAll(async () => await dbConnection.closeDatabase());

  const userController = new UserController(
    eventService, 
    emailService,
    teamService,
    userService
  );

  describe('get', () => {
    describe('for user with no application', () => {
      beforeAll(async () => {
        // Nothing in userModel i.e. no application in the system.
        await fakeAccount.save();
        await fakeEvent.save();
      });

      test('error is thrown', async () => {
        try {
          await userController.get(fakeEvent, fakeAccount);
        } catch (error) {
          expect(error).toEqual(new Error(ErrorMessage.USER_NOT_REGISTERED()));
        }
      });
    });

    describe('for user with application', () => { 
      beforeAll(async () => {
        await fakeAccount.save();
        await fakeEvent.save();
        await fakeUser.save(); 
      });

      test('returns application', async () => {
        const returnedUser = (await userController.get(fakeEvent, fakeAccount))[0];

        expect(returnedUser._id).toStrictEqual(fakeUser._id);
        expect(returnedUser.event.alias).toStrictEqual(fakeEvent.alias);
        expect(returnedUser.account._id).toStrictEqual(fakeAccount._id);
      });
    });
  });

  describe('registerNewUser', () => {
    const fakeApplication = generateFakeApplication({
      alias: fakeEvent.alias,
      user: {
        ...fakeUser.toObject(),
      }
    });
    describe('for non existent event', () => {
      test('error is thrown', async () => {
        try {
          await userController.registerNewUser({} as Express.Multer.File, fakeApplication, {} as Request);
        } catch (error) {
          expect(error).toEqual(new BadRequestError(ErrorMessage.NO_ALIAS_EXISTS(fakeApplication.alias)));
        }
      });  
    });
          
    describe('for closed event', () => {
      beforeAll(async () => {
        // Create new event that has closed already and save it
        const closedEvent = generateFakeEventDocument({
          closeTime: new Date(1995, 11, 17).toString()
        });
        await closedEvent.save()
      });

      test('error is thrown', async () => {
        try {
          await userController.registerNewUser({} as Express.Multer.File, 
            fakeApplication, {} as Request);
        } catch (error) {
          expect(error).toEqual(new BadRequestError(ErrorMessage.CANNOT_REGISTER()));
        }
      });
    });

    describe('for user with existing tesc.events account', () => {
      beforeEach(async () => {
        await fakeAccount.save()
      });

      describe('for user that has already applied to event', () => {
        beforeAll(async () => {
          await fakeEvent.save();
          await fakeUser.save();
        })

        test('error is thrown', async () => {
          try {
            await userController.registerNewUser({} as Express.Multer.File, 
              fakeApplication, {} as Request);
          } catch (error) {
            expect(error).toEqual(new BadRequestError(ErrorMessage.USER_ALREADY_REGISTERED()));
          }         
        });
      });

      describe('for user that has not applied to event', () => {
        beforeAll(async () => {
          await fakeEvent.save();
        })

        test('creates application', async () => {
          await userController.registerNewUser({
            path: path.join(__dirname, '../../test-resume.pdf')
          } as Express.Multer.File, fakeApplication, {} as Request); 

          const users = await userModel.find({});
          expect(users).toHaveLength(1);
        });
      });
    });

    describe('teams', () => {
      describe('for event without team option set', () => {
        const noTeamsEvent = generateFakeEventDocument({
          closeTime: new Date(new Date().getTime()+(5*24*60*60*1000)).toString(),
          options: {
            ...generateFakeEvent().options,
            allowTeammates: false
          }
        });

        beforeEach(async () => {
          await fakeAccount.save();
          await noTeamsEvent.save();
        });

        test('no team service methods are called', async () => {
          const getTeamByCodeSpy = jest.spyOn(teamService, 'getTeamByCode');
          const createNewTeamSpy = jest.spyOn(teamService, 'createNewTeam');
  
          await userController.registerNewUser({
            path: path.join(__dirname, '../../test-resume.pdf')
          } as Express.Multer.File, fakeApplication, {} as Request);
  
          expect(getTeamByCodeSpy).toHaveBeenCalledTimes(0);
          expect(createNewTeamSpy).toHaveBeenCalledTimes(0);
  
          getTeamByCodeSpy.mockRestore();
          createNewTeamSpy.mockRestore();
        });
      });

      describe('for event with team option set', () => {
        describe('for user creating a new team', () => {
          const fakeEvent = generateFakeEventDocument({
            closeTime: new Date(new Date().getTime()+(5*24*60*60*1000)).toString(),
            options: {
              ...generateFakeEvent().options,
              allowTeammates: true
            }
          });
  
          beforeEach(async () => {
            await fakeAccount.save();
            await fakeEvent.save();
          });

          test('creates team entity', async () => {
            await userController.registerNewUser({
              path: path.join(__dirname, '../../test-resume.pdf')
            } as Express.Multer.File, generateFakeApplication({
              alias: fakeEvent.alias,
              user: {
                ...fakeApplication.user,
                createTeam: true,
                teamCode: 'TESC'
              }
            }), {} as Request);
  
            // No Teams in DB before, there should be one now.
            expect((await teamModel.find({})).length).toBe(1);
            const users = await userModel.find({});
            expect(users).toHaveLength(1);
          })
        });


        describe('for user joining team', () => {
          const fakeEvent = generateFakeEventDocument({
            closeTime: new Date(new Date().getTime()+(5*24*60*60*1000)).toString(),
            options: {
              ...generateFakeEvent().options,
              allowTeammates: true
            }
          });
          const fakeTeam = generateFakeTeamDocument({
            event: fakeEvent.toObject()
          });

          beforeEach(async () => {
            await fakeAccount.save();
            await fakeEvent.save();
            await fakeTeam.save();
          });
          
          describe('for existent team', () => {
            test('joins team', async () => {
              await userController.registerNewUser({
                path: path.join(__dirname, '../../test-resume.pdf')
              } as Express.Multer.File, generateFakeApplication({
                alias: fakeEvent.alias,
                user: {
                  ...fakeApplication.user,
                  createTeam: false,
                  teamCode: 'L33T'
                }
              }), {} as Request);
    
              const teamBeingJoined = await teamModel.findOne({code: fakeTeam.code});
              expect(teamBeingJoined.members.length).toBe(fakeTeam.members.length + 1);
              const users = await userModel.find({});
              expect(users).toHaveLength(1);
            });
          });

          describe('for non existent team', () => {
            const fakeEvent = generateFakeEventDocument({
              closeTime: new Date(new Date().getTime()+(5*24*60*60*1000)).toString(),
              options: {
                ...generateFakeEvent().options,
                allowTeammates: true
              }
            });
            beforeAll(async () => {
              await fakeEvent.save();
              await teamModel.deleteMany({});
            });

            test('throws error', async () => {
              try {
                await userController.registerNewUser({
                  path: path.join(__dirname, '../../test-resume.pdf')
                } as Express.Multer.File, generateFakeApplication({
                  alias: fakeEvent.alias,
                  user: {
                    ...fakeApplication.user,
                    createTeam: false,
                    teamCode: 'L33T'
                  }
                }), {} as Request);
              } catch(e) {
                expect(e).toEqual(new BadRequestError(ErrorMessage.NO_TEAM_EXISTS('L33T')));
              }
            });
          });
        });
      });
    });
  });

  describe('updateUser', () => {
    beforeEach(async () => {
      await fakeAccount.save();
      
    });
  });
});