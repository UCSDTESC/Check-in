import { Question } from '@Shared/ModelTypes';
import React from 'react';
import FA from 'react-fontawesome';
import ToggleSwitch from '~/components/ToggleSwitch';

interface CustomQuestionProps {
  question: Question;
  onDelete: () => void;
  onChangeRequired: (newRequired: boolean) => void;
}

class CustomQuestion extends React.Component<CustomQuestionProps> {

  render() {
    const {question, onDelete, onChangeRequired} = this.props;

    return (
      <div className="row my-2">
        <div className="col px-0 d-flex align-items-center">
          {question.question}
        </div>
        <div
          className={`col-auto ml-auto flex-column custom-question__checkbox
          d-flex align-items-center justify-content-center`}
        >
          Required
          <ToggleSwitch
            checked={question.isRequired}
            onChange={onChangeRequired}
          />
        </div>
        <button
          className={`btn w-auto rounded-button px-2 py-0 bg-danger rounded-button--short col-auto`}
          onClick={onDelete}
        >
          <FA name="trash"/>
        </button>
      </div>
    );
  }
}

export default CustomQuestion;
