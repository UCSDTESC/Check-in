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
                    <div className="mt-2">
                       <h4>Long Questions</h4> 
                    </div>
                    <div className="mt-2">
                       <h4>Short Questions</h4> 
                    </div>
                    <div className="mt-2">
                       <h4>Checkbox Questions</h4> 
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomQuestions;