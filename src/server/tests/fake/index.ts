import { Inject, Container } from 'typedi';
import { EventModel } from '@Models/Event';
import { UserModel } from '@Models/User';
import { AccountModel } from '@Models/Account';
import { TESCEvent, TESCAccount, TESCUser } from '@Shared/ModelTypes';
import { RegisterUserRequest } from '@Shared/api/Requests';

const Event = Container.get<EventModel>('EventModel');
const User = Container.get<UserModel>('UserModel');
const Account = Container.get<AccountModel>('AccountModel');

type FakeableData = 
  | TESCUser
  | TESCEvent
  | TESCAccount

const baseTESCEvent = (): TESCEvent => ({
  name: 'TESC Event',
  alias: 'tescEvent',
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

export const generateFake = <T extends FakeableData>(p? : Partial<T>): T => {
}

export const populatedAccount = new Account(baseTESCAccount());

export const populatedEvent = new Event(baseTESCEvent());

export const populatedUser = new User(baseTESCUser());