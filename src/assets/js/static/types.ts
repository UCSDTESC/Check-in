import { Role } from './Roles';

export interface Download {
  _id: string;
  fileCount: number;
  adminId: string;
  accessUrl?: string;
  error: boolean;
  fulfilled: boolean;
}

export interface EventStatistics {
  count: number;
  universities: number;
  genders: {
    [GenderName: string]: number;
  };
  checkedIn: number;
  status: {
    [StatusType: string]: number;
  };
  resumes: number;
}

export interface Column {
  Header: string;
  accessor: string;
}

export interface FilterOptions {
  [FilterDisplayName: string]: boolean;
}

export interface Filter {
  displayName: string;
  enabled: boolean;
  editable: boolean;
  options: FilterOptions;
}

export interface Admin {
  _id: string;
  username: string;
  role: Role;
  checkin: boolean;
}

export interface Question {
  _id: string;
  question: string;
  isRequired: boolean;
}

export interface CustomQuestions {
  // TODO: Set string to enum of QuestionTypes from ~/static/Questions
  [QuestionType: string]: Question[];
}

export interface CustomQuestionResponses {
  [QuestionId: string]: string;
}

interface Logo {
  url: string;
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
  requireMajorGPA: boolean;
  requireWhyThisEvent: boolean;
}

export interface TESCEvent {
  _id: string;
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
  users?: number;
  customQuestions: CustomQuestions;
  options: TESCEventOptions;
}

export interface TESCAccount {
  _id: string;
  email: string;
  password: string;
  confirmed: boolean;
}

export interface TESCUser {
  _id: string;
  event?: TESCEvent;
  account?: TESCAccount;
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
  teammates?: string[];
  status?: string;
  checkedIn?: boolean;
  sanitized?: boolean;
  race?: boolean;
  classRequirement?: boolean;
  extraCurriculars?: string;
  gpa?: string;
  majorGPA?: string;
  customQuestionResponses?: CustomQuestionResponses;
  whyEventResponse?: string;
  resume: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}
