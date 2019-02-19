import React, {Component, Fragment} from 'react';

import QuestionInput from './QuestionInput';
import CustomQuestion from './CustomQuestion';

class CustomQuestions extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ...props.customQuestions
    }
  }

  onAddQuestion = (type, newQuestion) => {
    const {[type]: oldQuestions} = this.state;

    this.setState({
      [type]: [
        ...oldQuestions,
        newQuestion
      ]
    })
  }

  onDelete = (type, idx) => {
    const {[type]: questions} = this.state;
    questions.splice(idx, 1);

    this.setState({
      [type]: questions
    })
  }

  renderQuestions = (type) => {
    const {[type]: questions} = this.state;
    return questions.map((q, idx) => <CustomQuestion {...q} 
      idx={idx} type={type} onDelete={this.onDelete} />)
  }

  render() {

    const {onUpdateCustomQuestions} = this.props;    
      return(
          <div>
              <div className="event-options container no-gutters">
                  <div className="d-flex row flex-row">
                      <h2 className="align-self-start">Custom Questions</h2>         
                      <button className={`btn rounded-button rounded-button--small 
                          ml-auto my-auto rounded-button--short
                          rounded-button--secondary`}
                          onClick={() => onUpdateCustomQuestions(this.state)}>
                      Update
                      </button>
                  </div>

                  <Fragment>
                      <div className="mt-2 row d-flex">
                          <h4>Long Questions</h4> 
                      </div>
                      {this.renderQuestions('longText')}
                      <QuestionInput type="longText" 
                        onAddQuestion={this.onAddQuestion}/>
                  </Fragment>

                  <Fragment>
                      <div className="mt-2 row d-flex">
                          <h4>Short Questions</h4> 
                      </div>
                      {this.renderQuestions('shortText')}
                      <QuestionInput type="shortText" onAddQuestion={this.onAddQuestion}/>
                  </Fragment>
                  
                  <Fragment>
                      <div className="mt-2 row d-flex">
                          <h4>Checkbox Questions</h4> 
                      </div>
                      {this.renderQuestions('checkBox')}
                      <QuestionInput type="checkBox" onAddQuestion={this.onAddQuestion}/>
                  </Fragment>
              </div>
          </div>
      )
  }
}

export default CustomQuestions;