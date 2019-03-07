import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {CustomQuestionsShape as CustomQuestionsPropType} from '~/proptypes';

import {QuestionTypes} from '~/static/Questions';

import QuestionInput from './QuestionInput';
import CustomQuestion from './CustomQuestion';

class CustomQuestions extends Component {
  static propTypes = {
    customQuestions: CustomQuestionsPropType,
    isLoading: PropTypes.bool,
    onAddCustomQuestion: PropTypes.func.isRequired,
    onUpdateCustomQuestion: PropTypes.func.isRequired,
    onDeleteCustomQuestion: PropTypes.func.isRequired
  };

  onChangeRequired = (question) => {
    const {onUpdateCustomQuestion} = this.props;

    onUpdateCustomQuestion({
      ...question,
      isRequired: !question.isRequired
    });
  };

  renderQuestions = (type) => {
    const {onDeleteCustomQuestion} = this.props;
    const {[type]: questions} = this.props.customQuestions;

    return questions.map((q) => (<CustomQuestion
      key={q} question={q}
      onChangeRequired = {() => this.onChangeRequired(q)}
      onDelete={() => onDeleteCustomQuestion(type, q)} />));
  }

  render() {
    const {onAddCustomQuestion, isLoading} = this.props;

    return (
      <div>
        <div className="event-options container no-gutters">
          <div className="d-flex row flex-row">
            <h2 className="align-self-start">Custom Questions</h2>
            {!!isLoading && <img className="sd-form__loading ml-auto h-100"
              src="/img/site/loading.svg" />}
          </div>

          <div className="mt-2 row d-flex">
            <h4>Long Questions</h4>
          </div>
          {this.renderQuestions(QuestionTypes.QUESTION_LONG)}
          <QuestionInput onAddQuestion={(...opts) =>
            onAddCustomQuestion(QuestionTypes.QUESTION_LONG, ...opts)}/>

          <div className="mt-2 row d-flex">
            <h4>Short Questions</h4>
          </div>
          {this.renderQuestions(QuestionTypes.QUESTION_SHORT)}
          <QuestionInput onAddQuestion={(...opts) =>
            onAddCustomQuestion(QuestionTypes.QUESTION_SHORT, ...opts)} />

          <div className="mt-2 row d-flex">
            <h4>Checkbox Questions</h4>
          </div>
          {this.renderQuestions(QuestionTypes.QUESTION_CHECKBOX)}
          <QuestionInput onAddQuestion={(...opts) =>
            onAddCustomQuestion(QuestionTypes.QUESTION_CHECKBOX, ...opts)}/>
        </div>
      </div>
    );
  }
}

export default CustomQuestions;
