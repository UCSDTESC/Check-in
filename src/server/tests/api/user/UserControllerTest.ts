import UserService from '@Services/UserService';
import EventService from '@Services/EventService';
import EmailService from '@Services/EmailService';
import TeamService from '@Services/TeamService';
import { AccountModel, AccountDocument } from '@Models/Account';
import { UserController } from '../../../api/controllers/user/UserController';
import { Container } from 'typedi';
import { ErrorMessage } from '../../../utils/Errors';
import { 
  generateFakeApplication, 
  generateFakeEventDocument, 
  generateFakeEvent, 
  generateFakeAccountDocument, 
  generateFakeUserDocument, 
  generateFakeTeamDocument } from '../../fake';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { EventModel, EventDocument } from '@Models/Event';
import { UserModel, UserDocument } from '@Models/User';
import { BadRequestError, ForbiddenError } from 'routing-controllers';
import { Request } from 'express-serve-static-core';
import { TeamModel } from '@Models/Team';
import * as path from 'path';
import { setIsNew } from '../../utils';
import { UserGenderOptions, UserPronounOptions } from '@Shared/UserEnums';
import { TESCUser, MAX_TEAM_SIZE } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';

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

    await dbConnection.clearDatabase();
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
      beforeEach(async () => {
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
      beforeEach(async () => {
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
      beforeEach(async () => {
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
        beforeEach(async () => {
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
        beforeEach(async () => {
          await fakeEvent.save();
        })

        test('creates application', async () => {
          await userController.registerNewUser({
            path: path.join(__dirname, '../../test-resume.pdf')
          } as Express.Multer.File, fakeApplication, {
            get: (a: string) => 'fake-get'
          } as Request); 

          const users = await userModel.find({});
          expect(users).toHaveLength(1);
        });
      });
    });

    describe('for user without existing tesc.events account', () => {
      const newApplication = generateFakeApplication({
        alias: fakeEvent.alias,
      })
      beforeEach(async () => {
        await fakeEvent.save();
      });
      
      test('creates application and sends create application email', async () => {
        const sendAccountConfirmEmailSpy = jest.spyOn(emailService, 'sendAccountConfirmEmail');
        
        await userController.registerNewUser({
          path: path.join(__dirname, '../../test-resume.pdf')
        } as Express.Multer.File, newApplication, {
          get: (a: string) => 'fake-get'
        } as Request); 

        const users = await userModel.find({});
        const accounts = await accountModel.find({});

        expect(users).toHaveLength(1);
        expect(accounts).toHaveLength(1);
        expect(sendAccountConfirmEmailSpy).toHaveBeenCalled();
      });
    })

    describe('teams', () => {
      describe('for event without team option set', () => {
        let noTeamsEvent: EventDocument;
        beforeEach(async () => {
          noTeamsEvent = generateFakeEventDocument({
            closeTime: new Date(new Date().getTime()+(5*24*60*60*1000)).toString(),
            options: {
              ...generateFakeEvent().options,
              allowTeammates: false
            }
          });

          await fakeAccount.save();
          await noTeamsEvent.save();
        });

        test('no team service methods are called', async () => {
          const newApplication = generateFakeApplication({
            alias: noTeamsEvent.alias,
          });

          const getTeamByCodeSpy = jest.spyOn(teamService, 'getTeamByCode');
          const createNewTeamSpy = jest.spyOn(teamService, 'createNewTeam');
          await userController.registerNewUser({
            path: path.join(__dirname, '../../test-resume.pdf')
          } as Express.Multer.File, newApplication, {
            get: (a: string) => 'fake-get'
          } as Request);
  
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
          const teamsEvent = generateFakeEventDocument({
            closeTime: new Date(new Date().getTime()+(5*24*60*60*1000)).toString(),
            options: {
              ...generateFakeEvent().options,
              allowTeammates: true
            }
          });
          const fakeTeam = generateFakeTeamDocument({
            event: teamsEvent.toObject()
          });

          beforeEach(async () => {
            await fakeAccount.save();
            await teamsEvent.save();
            await fakeTeam.save();
          });
          
          describe('for existent team', () => {
            test('joins team', async () => {
              await userController.registerNewUser({
                path: path.join(__dirname, '../../test-resume.pdf')
              } as Express.Multer.File, generateFakeApplication({
                alias: teamsEvent.alias,
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

            describe('for full team', () => {
              beforeEach(async () => {
                // rip hack
                setIsNew(teamsEvent, true);
                setIsNew(fakeTeam, true);

                await teamsEvent.save();
                await fakeTeam.save();

                for (let i = 0; i < MAX_TEAM_SIZE; i++) {
                  await userController.registerNewUser({
                    path: path.join(__dirname, '../../test-resume.pdf')
                  } as Express.Multer.File, generateFakeApplication({
                    alias: teamsEvent.alias,
                    user: {
                      ...generateFakeUserDocument({
                        account: generateFakeAccountDocument({
                          email: `fake-${i}@tesc.ucsd.edu`
                        }),
                        event: teamsEvent.toObject()
                      }).toObject(),
                      createTeam: false,
                      teamCode: 'L33T'
                    }
                  }), {} as Request);
                }
              });

              test('throws error on joining', async () => {

                try {
                  await userController.registerNewUser({
                    path: path.join(__dirname, '../../test-resume.pdf')
                  } as Express.Multer.File, generateFakeApplication({
                    alias: teamsEvent.alias,
                    user: {
                      ...generateFakeUserDocument({
                        account: generateFakeAccountDocument({
                          email: `fake-5@tesc.ucsd.edu`
                        }),
                        event: teamsEvent.toObject()
                      }).toObject(),
                      createTeam: false,
                      teamCode: 'L33T'
                    }
                  }), {} as Request);
                } catch(e) {
                  expect(e).toEqual(new BadRequestError(ErrorMessage.TEAM_FULL('L33T', MAX_TEAM_SIZE)));
                }

              })
            })
          });

          describe('for non existent team', () => {
            const fakeEvent = generateFakeEventDocument({
              closeTime: new Date(new Date().getTime()+(5*24*60*60*1000)).toString(),
              options: {
                ...generateFakeEvent().options,
                allowTeammates: true
              }
            });
            beforeEach(async () => {
              await fakeEvent.save();
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

    describe('for user that does not exist in database', () => {
      test('throws error', async () => {
        try {
          await userController.updateUser(fakeAccount, {} as Express.Multer.File, {});
        } catch (error) {
          expect(error).toEqual(new BadRequestError(ErrorMessage.NO_USER_EXISTS()));
        }
      });
    });
    
    describe('for user in the database', () => {
      beforeEach(async () => {
        await fakeUser.save();
      });

      test('cannot update uneditable fields', async () => {
        // Using `checkedIn` as a test for an uneditable field
        // TODO: make test better

        const updatedUser = await userController.updateUser(fakeAccount, {
          path: path.join(__dirname, '../../test-resume.pdf') 
        } as Express.Multer.File, {checkedIn: true});

        expect(updatedUser.checkedIn).toBeFalsy();
      });

      test('updates editable fields', async () => {
        const updatableDelta: Partial<TESCUser> = {
          gender: UserGenderOptions[2],
          pronouns: UserPronounOptions[2],
          website: 'tesc.ucsd.edu',
          food: 'Soylent Only'
        }
        const updatedUser = await userController.updateUser(fakeAccount, {
          path: path.join(__dirname, '../../test-resume.pdf') 
        } as Express.Multer.File, updatableDelta);

        for (const [key, value] of Object.entries(updatableDelta)) {
          expect(updatedUser[key]).toBe(value)
        }
      });
    });
  });

  describe('userRSVP', () => {
    beforeEach(async () => {
      await fakeAccount.save();
    });

    describe('for user that does not match logged in user', () => {
      let user: UserDocument, account: AccountDocument;
      beforeEach(async () => {
        account = generateFakeAccountDocument({email: 'tech@tesc.ucsd.edu'});
        await account.save();
        user = generateFakeUserDocument({
          account: account.toObject(), 
          event: fakeEvent.toObject()
        });
        await user.save();
      });
      test('throws error', async () => {
        try {
          await userController.userRSVP(user, fakeAccount, {status: true, bussing: false});
        } catch (error) {
          expect(error).toEqual(new BadRequestError(ErrorMessage.NO_USER_EXISTS()));
        }
      });
    });

    describe('for valid user', () => {
      beforeEach(async () => {
        await fakeAccount.save();
        await fakeEvent.save();
        await fakeUser.save();
      });

      describe('for user that has not been accepted', () => {
        test('throws error', async () => {
          try {
            await userController.userRSVP(fakeUser, fakeAccount, {status: true, bussing: false});
          } catch (error) {
            expect(error).toEqual(new ForbiddenError(ErrorMessage.PERMISSION_ERROR()));
          }
        }) 
      });

      describe('for user that has been accepted', () => {
        let user: UserDocument;
        beforeEach(async () => {

          // making the new user under the same account, so we
          // should remove the default
          await userModel.remove({_id: fakeUser._id});
          user = generateFakeUserDocument({
            account: fakeAccount.toObject(),
            event: fakeEvent.toObject(),
            firstName: 'User With Unconfirmed Status',
            status: UserStatus.Unconfirmed
          });
        });

        test('sets rsvp to true', async () => {
          const newUser = await userController.userRSVP(user, fakeAccount, {status: true, bussing: false});
          expect(newUser.status).toBe(UserStatus.Confirmed);
        });
  
        test('sets rsvp to false', async () => {
          const newUser = await userController.userRSVP(user, fakeAccount, {status: false, bussing: false});
          expect(newUser.status).toBe(UserStatus.Declined);
        });

        test('does not set bussing to true for event without bussing enabled', async () => {
          const newUser = await userController.userRSVP(user, fakeAccount, {status: true, bussing: true});
          expect(newUser.bussing).toBe(false);
        });

        describe('for event with bussing enabled', () => {
          beforeEach(async () => {
            await userModel.remove({_id: fakeUser._id});
            await fakeEvent.update({bussing: true});
            user = generateFakeUserDocument({
              account: fakeAccount.toObject(),
              event: fakeEvent.toObject(),
              firstName: 'User With Unconfirmed Status',
              status: UserStatus.Unconfirmed,
              availableBus: 'UCLA'
            });
            await user.save();
          });

          test('sets bussing to true', async () => {
            const newUser = await userController.userRSVP(user, fakeAccount, {status: true, bussing: true});
            expect(newUser.bussing).toBe(true);
          });
        });
      });

    });
  });

  describe('getTeam', () => {
    beforeEach(async () => {
      await fakeEvent.save();
      await fakeAccount.save();
      await fakeUser.save();
    });

    describe('for user that does not match logged in user', () => {
      let user: UserDocument, account: AccountDocument;
      beforeEach(async () => {
        account = generateFakeAccountDocument({email: 'tech@tesc.ucsd.edu'});
        await account.save();
        user = generateFakeUserDocument({
          account: account.toObject(), 
          event: fakeEvent.toObject()
        });
        await user.save();
      });
      test('throws error', async () => {
        try {
          await userController.getTeam(user, fakeAccount);
        } catch (error) {
          expect(error).toEqual(new BadRequestError(ErrorMessage.NO_USER_EXISTS()));
        }
      });
    });

    describe('for user with no team', () => {
      test('throws error', async () => {
        try {
          await userController.getTeam(fakeUser, fakeAccount);
        } catch (error) {
          expect(error).toEqual(new Error(ErrorMessage.USER_HAS_NO_TEAM()));
        }
      })
    });
  });
});