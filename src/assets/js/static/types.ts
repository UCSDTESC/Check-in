export interface EventStatistics {
  count: number,
  universities: number,
  genders: {
    [GenderName: string]: number
  },
  checkedIn: number,
  status: {
    [StatusType: string]: number
  },
  resumes: number
};

export interface Column {
  Header: string,
  accessor: string
};

export interface FilterOptions {
  [FilterDisplayName: string]: boolean
};

export interface Filter {
  displayName: string,
  enabled: boolean,
  editable: boolean,
  options: FilterOptions
};

export interface Admin {
  _id: string,
  username: string,
  role: string
};

export interface Question {
  _id: string,
  question: string,
  isRequired: boolean
};

export interface CustomQuestions {
  //TODO: Set string to enum of QuestionTypes from ~/static/Questions
  [QuestionType: string]: Question[]
};

export interface CustomQuestionResponses {
  [QuestionId: string]: string
};

interface Logo {
  url: string
};

export interface TESCEvent {
  _id: string,
  name: string,
  alias: string,
  organisers: Admin[],
  logo: Logo,
  thirdPartyText?: string,
  organisedBy: string,
  users: number,
  closeTime: string,
  homepage: string,
  description: string,
  email: string,
  customQuestions: CustomQuestions
};

export interface TESCAccount {
  email: string,
  password: string,
  confirmed: boolean
};

export interface TESCUser {
  event?: TESCEvent,
  account?: TESCAccount,
  firstName: string,
  lastName: string,
  birthdate: string,
  gender: string,
  phone: string,
  university?: string,
  highSchool?: string,
  pid?: string,
  major?: string,
  year?: string,
  github?: string,
  website?: string,
  shareResume: boolean,
  food?: string,
  diet?: string,
  shirtSize?: string,
  travel?: {
    outOfState?: boolean,
    city?: string
  },
  availableBus?: string,
  bussing?: boolean,
  teammates?: string[],
  status?: string,
  checkedIn?: boolean,
  sanitized?: boolean,
  race?: boolean,
  classRequirement?: boolean,
  extraCurriculars?: string,
  gpa?: string,
  majorGPA?: string,
  customQuestionResponses?: CustomQuestionResponses,
  whyEventResponse?: string
};
