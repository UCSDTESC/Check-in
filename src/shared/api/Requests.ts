import { Question, UserStatus, TESCEventOptions } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';

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
