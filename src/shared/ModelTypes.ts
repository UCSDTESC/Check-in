import { UserStatus } from '@Shared/UserStatus';
import { ObjectID } from 'bson';

import { Role } from './Roles';

export const TEAM_CODE_LENGTH = 4;
export const MAX_TEAM_SIZE = 4;

export interface AccountPasswordReset {
  _id?: string & ObjectID;
  account: TESCAccount;
  resetString: string;
  expires: Date;
  valid: boolean;
}

export interface TESCTeam {
  _id?: string & ObjectID;
  event: TESCEvent;
  code: string;
  members: TESCUser[];
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

export type Resume = UploadedFile;

export type Logo = UploadedFile;

export interface Download {
  _id?: string & ObjectID;
  fileCount: number;
  admin: Admin;
  accessUrl?: string;
  error: boolean;
  fulfilled: boolean;
  deleted?: boolean;
}

export interface Admin {
  _id?: string & ObjectID;
  username: string;
  password: string;
  role: Role;
  checkin: boolean;
  lastAccessed: Date;
  deleted?: boolean;
}

export interface Question {
  _id?: string & ObjectID;
  question: string;
  isRequired: boolean;
  deleted?: boolean;
}

export interface CustomQuestions {
  // TODO: Set string to enum of QuestionTypes from ~/static/Questions
  [QuestionType: string]: Question[];
}

export interface CustomQuestionResponses {
  [QuestionId: string]: string;
}

export interface TESCEventOptions {
  allowHighSchool: boolean;
  mlhProvisions: boolean;
  allowOutOfState: boolean;
  foodOption: boolean;
  requireResume: boolean;
  allowTeammates: boolean;
  requireDiversityOption: boolean;
  requireClassRequirement: boolean;
  requireExtraCurriculars: boolean;
  requireGPA: boolean;
  enableGPA: boolean;
  requireMajorGPA: boolean;
  requireWhyThisEvent: boolean;
}

export interface TESCEvent {
  _id?: string & ObjectID;
  name: string;
  alias: string;
  organisers: Admin[];
  sponsors: Admin[];
  closeTime: string;
  homepage: string;
  description: string;
  email: string;
  checkinWaiver?: string;
  thirdPartyText?: string;
  organisedBy: string;
  logo: Logo;
  customQuestions: CustomQuestions;
  options: TESCEventOptions;
  deleted?: boolean;
  users?: number;
}

export interface TESCAccount {
  _id?: string & ObjectID;
  email: string;
  password: string;
  confirmed: boolean;
  deleted?: boolean;
}

export interface TESCUser {
  _id?: string & ObjectID;
  event?: TESCEvent;
  account?: TESCAccount;
  team?: TESCTeam;
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  phone: string;
  university?: string;
  highSchool?: string;
  pid?: string;
  major?: string;
  year?: string;
  github?: string;
  website?: string;
  shareResume: boolean;
  food?: string;
  diet?: string;
  shirtSize?: string;
  travel?: {
    outOfState?: boolean;
    city?: string;
  };
  availableBus?: string;
  bussing?: boolean;
  status?: UserStatus;
  checkedIn?: boolean;
  sanitized?: boolean;
  race?: string;
  classRequirement?: boolean;
  extraCurriculars?: string;
  gpa?: string;
  majorGPA?: string;
  customQuestionResponses?: CustomQuestionResponses;
  whyEventResponse?: string;
  resume?: Resume;
  deleted?: boolean;
}
