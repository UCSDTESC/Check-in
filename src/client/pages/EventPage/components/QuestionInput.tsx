import { Question } from 'Shared/types';
import React from 'react';
import FA from 'react-fontawesome';
import ToggleSwitch from '~/components/ToggleSwitch';

interface QuestionInputProps {
  onAddQuestion: (toAdd: Question) => void;
}

interface QuestionInputState {
  question: string;
  isRequired: boolean;
}

export default class QuestionInput extends React.Component<QuestionInputProps, QuestionInputState> {
  state: Readonly<QuestionInputState> = {
    question: '',
    isRequired: false,
  };

  addQuestion = () => {
    this.props.onAddQuestion(this.state);
    this.setState({
      question: '',
      isRequired: false,
    });
  }

  render() {

    const {question, isRequired} = this.state;
    return (
      <div className="row flex-row">
        <div className="col px-0">
          <input
            className="form-control"
            placeholder="Your Question Here..."
            value={question}
            type="textbox"
            onChange={e => this.setState({question: e.currentTarget.value})}
          />
        </div>
        <div
          className={`col-auto ml-auto flex-column custom-question__checkbox d-flex align-items-center
          justify-content-center`}
        >
          Required
          <ToggleSwitch
            checked={isRequired}
            onChange={() => this.setState({isRequired: !isRequired})}
          />
        </div>
        <button
          className={`btn w-auto rounded-button px-2 py-0 rounded-button--short col-auto`}
          disabled={!question}
          onClick={this.addQuestion}
        >
          <FA name="plus"/>
        </button>
      </div>
    );
  }
}
