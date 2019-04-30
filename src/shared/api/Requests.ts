import { QuestionType } from '@Shared/Questions';
import { Question } from '@Shared/Types';

export interface CheckinUserRequest {
  id: string;
}

export interface AddCustomQuestionRequest {
  question: Question;
  type: QuestionType;
}
