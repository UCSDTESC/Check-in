import { Inject, Container } from 'typedi';
import { EventModel, EventDocument } from '@Models/Event';
import { UserModel } from '@Models/User';
import { AccountModel } from '@Models/Account';
import { TESCEvent, TESCAccount, TESCUser, TESCTeam } from '@Shared/ModelTypes';
import { RegisterUserRequest } from '@Shared/api/Requests';
import { TeamModel } from '@Models/Team';

const Event = Container.get<EventModel>('EventModel');
const User = Container.get<UserModel>('UserModel');
const Account = Container.get<AccountModel>('AccountModel');
const Team = Container.get<TeamModel>('TeamModel');

const baseTESCEvent = (): TESCEvent => ({
  name: 'TESC Event',
  alias: 'tesc-event',
  organisers: [],
  organisedBy: 'TESC',
  closeTime: new Date().toString(),
  sponsors: [],
  homepage: 'www.tesc.ucsd.edu',
  description: 'TESC Event Description',
  email: 'hello@tesc.ucsd.edu',
  logo: {
    name: 'logo',
    size: 123,
    type: 'img/png',
    url: ''
  },
  customQuestions: {},
  options: {
    allowHighSchool: false,
    mlhProvisions: false,
    allowOutOfState: false,
    foodOption: false,
    requireResume: false,
    allowTeammates: false,
    requireDiversityOption: false,
    requireClassRequirement: false,
    requireExtraCurriculars: false,
    requireGPA: false,
    enableGPA: false,
    requireMajorGPA: false,
    requireWhyThisEvent: false
  },
});

const baseTESCAccount = (): TESCAccount => ({
  email: 'hello@tesc.ucsd.edu',
  password: 'abcde',
  confirmed: false,
  deleted: false
})

const baseTESCUser = (): TESCUser => ({
  firstName: 'First',
  lastName: 'Last',
  birthdate: new Date().toString(),
  gender: 'Female',
  phone: '1234567890',
  shareResume: false,
  event: baseTESCEvent(),
  account: baseTESCAccount(),
})

const baseTESCTeam = (): TESCTeam => ({
  event: baseTESCEvent(),
  code: 'L33T',
  members: []
})

const baseApplication = (): RegisterUserRequest => ({
  alias: 'some-event-alias',
  user: {
    email: 'fake@tesc.ucsd.edu',
    ...generateFakeUserDocument().toObject(),
    teamCode: 'ABCD',
    createTeam: false,
    customQuestionResponses: new Map<string, string>(),
    provision: false,
    accept: false
  }
})

export const generateFakeApplication = (p?: Partial<RegisterUserRequest>): RegisterUserRequest => {
  return {
    ...baseApplication(),
    ...p
  }
}

export const generateFakeUser = (p?: Partial<TESCUser>): TESCUser => {
  return {
    ...baseTESCUser(),
    ...p
  }
}

export const generateFakeEvent = (p?: Partial<TESCEvent>): TESCEvent => {
  return {
    ...baseTESCEvent(),
    ...p
  }
}

export const generateFakeAccount = (p?: Partial<TESCAccount>): TESCAccount => {
  return {
    ...baseTESCAccount(),
    ...p
  }
}

export const generateFakeTeam = (p?: Partial<TESCTeam>): TESCTeam => {
  return {
    ...baseTESCTeam(),
    ...p
  }
}

export const generateFakeEventDocument = (p?: Partial<TESCEvent>) => new Event(generateFakeEvent(p))

export const generateFakeUserDocument = (p?: Partial<TESCUser>) => new User(generateFakeUser(p))

export const generateFakeAccountDocument = (p?: Partial<TESCUser>) => new Account(generateFakeAccount(p))

export const generateFakeTeamDocument = (p?: Partial<TESCTeam>) => new Team(generateFakeTeam(p));