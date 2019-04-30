import { QuestionType } from '@Shared/Questions';
import { Question, UserStatus } from '@Shared/Types';

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
