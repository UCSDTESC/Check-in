import React, {Component} from 'react';

class CustomQuestions extends Component {

    render() {
        return(
            <div>
                <div className="event-options">
                    <div className="d-flex flex-row">
                        <h2 className="align-self-start">Custom Questions</h2>         
                        <button className="btn rounded-button rounded-button--small align-self-end my-auto"
                        onClick={() => onOptionsUpdate(this.state.options)}>
                        Update
                        </button>
                    </div>
                    <div className="mt-2 d-flex">
                       <h4>Long Questions</h4> 
                       <span className="btn rounded-button px-2 py-0 rounded-circle w-auto ml-auto"> + </span>
                    </div>
                    <div className="mt-2 d-flex">
                       <h4>Short Questions</h4> 
                       <span className="btn rounded-button px-2 py-0 rounded-circle w-auto ml-auto"> + </span>

                    </div>
                    <div className="mt-2 d-flex">
                       <h4>Checkbox Questions</h4> 
                       <span className="btn rounded-button px-2 py-0 rounded-circle w-auto ml-auto"> + </span>

                    </div>
                </div>
            </div>
        )
    }
}

export default CustomQuestions;