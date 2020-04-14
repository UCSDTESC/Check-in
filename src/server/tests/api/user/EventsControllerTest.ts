import EventService from '@Services/EventService';
import TeamService from '@Services/TeamService';
import { TEAM_CODE_LENGTH } from '@Shared/ModelTypes';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { generateFakeEventDocument, generateFakeAccountDocument, generateFakeUserDocument, generateFakeTeamDocument } from '../../fake';
import { Container } from 'typedi';
import { setIsNew } from '../../utils';
import { EventsController } from '../../../api/controllers/user/EventsController';

describe('EventsController', () => {
  const dbConnection = new TestDatabaseConnection();
  const eventService = Container.get(EventService);
  const teamService = Container.get(TeamService);

  let fakeAccount = generateFakeAccountDocument();
  let fakeEvent = generateFakeEventDocument({
    closeTime: new Date(
      new Date().getTime()+(5*24*60*60*1000)).toString()
  });
  let fakeUser = generateFakeUserDocument({
    account: fakeAccount.toObject(),
    event: fakeEvent.toObject()
  });
  let fakeTeam = generateFakeTeamDocument({
    code: 'L33T',
    event: fakeEvent
  });

  beforeAll(async () => await dbConnection.connect());

  afterEach(async () => {
    setIsNew(fakeAccount, true);
    setIsNew(fakeEvent, true);
    setIsNew(fakeUser, true);
    setIsNew(fakeTeam, true);

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

    describe('for selected event', () => {
      beforeEach(async () => {
        await fakeEvent.save();
      });
      test('returns the event document', async () => {
        const {events} = await eventsController.get(fakeEvent);
  
        expect(events).toHaveLength(1);
        expect(events[0].alias).toEqual(fakeEvent.alias);
      });

      test('returns undefined for no registered users', async () => {
        const {userCounts} = await eventsController.get(fakeEvent);

        expect(userCounts[fakeEvent._id]).toBe(undefined);
      });
    });
  });

  describe('getTeamCode', () => {
    test('generates team code of length 4', async () => {
      const teamCode = await eventsController.getTeamCode();

      expect(teamCode.length).toBe(TEAM_CODE_LENGTH);
    });

    describe.skip('for team code that already exists', () => {
      // not sure how to test this, you'd have to somehow inject 
      // behavior into Math.random
    });
  });
});
