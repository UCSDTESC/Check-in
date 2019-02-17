import React, {Component} from 'react';
import FA from 'react-fontawesome';
import ToggleSwitch from '~/components/ToggleSwitch';

export default class QuestionInput extends Component {

    constructor(props) {
      super(props);
  
      this.state = {
        question: '',
        isRequired: false
      }
    }

    addQuestion = () => {
      this.props.onAddQuestion(this.props.type, this.state);
    }
  
    render() {
      
      const {question, isRequired} = this.state;
      return (
        <div className="row flex-row">
            <div className="col px-0">
                <input className="form-control" 
                  onChange={e => this.setState({question: e.target.value})}/>
            </div>
            <div className={`col-auto ml-auto flex-column custom-question__checkbox
              d-flex align-items-center justify-content-center`}>
              Required
              <ToggleSwitch checked={isRequired} onChange={() => this.setState({isRequired: !isRequired})}/>
            </div>
            <button className={`btn w-auto
              rounded-button px-2 py-0 
              rounded-button--short col-auto`}
              disabled={!question}
              onClick={this.addQuestion}
            > <FA name="plus"/> </button>
        </div>
      );
    }
}