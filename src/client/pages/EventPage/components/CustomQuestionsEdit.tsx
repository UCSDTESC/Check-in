import { QuestionType } from '@Shared/Questions';
import { Question, CustomQuestions } from '@Shared/Types';
import React from 'react';

import CustomQuestion from './CustomQuestion';
import QuestionInput from './QuestionInput';

interface CustomQuestionsProps {
  customQuestions: CustomQuestions;
  isLoading?: boolean;
  onAddCustomQuestion: (type: QuestionType, ...opts: any[]) => void;
  onUpdateCustomQuestion: (toUpdate: Question) => void;
  onDeleteCustomQuestion: (type: QuestionType, toDelete: Question) => void;
}

export default class CustomQuestionsEdit extends React.Component<CustomQuestionsProps> {
  onChangeRequired = (question: Question) => {
    const {onUpdateCustomQuestion} = this.props;

    onUpdateCustomQuestion({
      ...question,
      isRequired: !question.isRequired,
    });
  };

  renderQuestions = (type: QuestionType) => {
    const {onDeleteCustomQuestion} = this.props;
    const {[type]: questions} = this.props.customQuestions;

    return questions.map((q) => (
      <CustomQuestion
        key={q._id}
        question={q}
        onChangeRequired={() => this.onChangeRequired(q)}
        onDelete={() => onDeleteCustomQuestion(type, q)}
      />
    ));
  }

  render() {
    const {onAddCustomQuestion, isLoading} = this.props;

    return (
      <div>
        <div className="event-options container no-gutters">
          <div className="d-flex row flex-row">
            <h2 className="align-self-start">Custom Questions</h2>
            {!!isLoading && <img
              className="sd-form__loading ml-auto h-100"
              src="/img/site/loading.svg"
            />}
          </div>

          <div className="mt-2 row d-flex">
            <h4>Long Questions</h4>
          </div>
          {this.renderQuestions(QuestionType.QUESTION_LONG)}
          <QuestionInput
            onAddQuestion={(...opts) =>
            onAddCustomQuestion(QuestionType.QUESTION_LONG, ...opts)}
          />

          <div className="mt-2 row d-flex">
            <h4>Short Questions</h4>
          </div>
          {this.renderQuestions(QuestionType.QUESTION_SHORT)}
          <QuestionInput
            onAddQuestion={(...opts) =>
            onAddCustomQuestion(QuestionType.QUESTION_SHORT, ...opts)}
          />

          <div className="mt-2 row d-flex">
            <h4>Checkbox Questions</h4>
          </div>
          {this.renderQuestions(QuestionType.QUESTION_CHECKBOX)}
          <QuestionInput
            onAddQuestion={(...opts) =>
            onAddCustomQuestion(QuestionType.QUESTION_CHECKBOX, ...opts)}
          />
        </div>
      </div>
    );
  }
}
