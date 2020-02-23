import UserService from '@Services/UserService';
import EventService from '@Services/EventService';
import EmailService from '@Services/EmailService';
import TeamService from '@Services/TeamService';
import { AccountModel } from '@Models/Account';
import { UserModel, PUBLIC_USER_FIELDS } from '@Models/User';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { generateFakeApplication, generateFakeEventDocument, generateFakeEvent, generateFakeAccountDocument, generateFakeUserDocument, generateFakeTeamDocument } from '../../fake';
import { TeamModel } from '@Models/Team';
import { EventModel } from '@Models/Event';
import { Container } from 'typedi';
import { setIsNew } from '../../utils';
import { EventsController } from '../../../api/controllers/user/EventsController';

describe('EventsController', () => {
  const dbConnection = new TestDatabaseConnection();
  const eventService = Container.get(EventService);
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

  const eventsController = new EventsController(eventService, teamService);

  describe('get', () => {
    let anotherFakeEvent = generateFakeEventDocument({
      name: 'TESC Event 2',
      alias: 'event-2',
      closeTime: new Date(
        new Date().getTime()+(5*24*60*60*1000)).toString()
    });
    
    let closedEvent = generateFakeEventDocument({
      alias: 'closed',
      name: 'Closed Event',
      closeTime: new Date(
        new Date().getTime()-(5*24*60*60*1000)).toString()
    });

    describe('when no event id is selected', () => {
      beforeEach(async () => {
        await anotherFakeEvent.save();
        await closedEvent.save();
        await fakeEvent.save();
        await fakeAccount.save();
        await fakeUser.save();
      });
      test('returns all events irrespective of close time', async () => {
        const {events} = await eventsController.get(null);
  
        expect(events).toHaveLength(3);
        expect(
          events.map(e => e.alias).sort()
        ).toEqual(
          [anotherFakeEvent.alias, fakeEvent.alias, closedEvent.alias].sort()
        );
      })
    })

    describe('for selected event', async () => {
      beforeEach(async () => {
        await fakeEvent.save();
      });
      test('returns the event document', async () => {
        const {events} = await eventsController.get(fakeEvent);
  
        expect(events).toHaveLength(1);
        expect(events[0].alias).toEqual(fakeEvent.alias);
      });
    })
  });
});
