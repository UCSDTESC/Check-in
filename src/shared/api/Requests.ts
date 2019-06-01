import { Question, TESCEventOptions, TESCUser } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';
import { Role } from '@Shared/Roles';
import { UserStatus } from '@Shared/UserStatus';

export interface CheckinUserRequest {
  id: string;
}

export interface AddCustomQuestionRequest {
  question: Question;
  type: QuestionType;
}

export interface UpdateCustomQuestionRequest {
  question: Question;
}

export interface DeleteCustomQuestionRequest {
  question: Question;
  type: QuestionType;
}

export interface BulkChangeRequest {
  users: string[];
  status: UserStatus;
}

export interface UpdateEventOptionsRequest {
  options: TESCEventOptions;
}

export interface AddNewSponsorRequest {
  sponsorId: string;
}

export interface AddNewOrganiserRequest {
  organiserId: string;
}

export interface DownloadResumesRequest {
  applicants: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetString: string;
  newPassword: string;
}

export interface RegisterAdminRequest {
  username: string;
  password: string;
  role: Role;
}

export interface DeleteAdminRequest {
  id: string;
}

export interface RegisterEventRequest {
  name: string;
  alias: string;
  closeTime: string;
  homepage: string;
  email: string;
  description: string;
  organisedBy: string;
  thirdPartyText?: string;
}

export interface RegisterUserPersonalSectionRequest {
  email: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  phone: string;
  major?: string;
  year?: string;
  github?: string;
  website?: string;
  shareResume: boolean;
  university?: string;
  highSchool?: string;
  pid?: string;
  gpa?: string;
  majorGPA?: string;
  race?: string;
}

export interface RegisterUserResponseSectionRequest {
  customQuestionResponses?: Map<string, string>;
  food?: string;
  diet?: string;
  whyEventResponse?: string;
  travel?: {
    outOfState?: boolean;
    city?: string;
  };
  extraCurriculars?: string;
  shirtSize?: string;
  classRequirement?: boolean;
  teammates: string[];
}

export interface RegisterUserUserSectionRequest {
  provision: boolean;
  accept: boolean;
  password?: string;
  confirmPassword?: string;
}

export type RegisterUserRequest = RegisterUserPersonalSectionRequest &
  RegisterUserResponseSectionRequest & RegisterUserUserSectionRequest;

export type UpdateUserRequest = Partial<TESCUser>;

export interface RSVPUserRequest {
  status: boolean;
  bussing: boolean;
}

export interface StatusEmailRequest {
  user: TESCUser;
}
