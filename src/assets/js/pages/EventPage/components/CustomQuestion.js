import React, {Component} from 'react';
import ToggleSwitch from '~/components/ToggleSwitch';
import FA from 'react-fontawesome';

class CustomQuestion extends Component {

    deleteQuestion = () => {
        this.props.onDelete(this.props.type, this.props.idx);
    }

    render() {
        const {isRequired, question} = this.props;

        return (
            <div className="row my-2">
                <div className="col px-0 d-flex align-items-center">
                    {question}
                </div>
                <div className={`col-auto ml-auto flex-column custom-question__checkbox
                    d-flex align-items-center justify-content-center`}>
                    Required
                    <ToggleSwitch checked={isRequired} disabled={true}/>
                </div>
                <button className={`btn w-auto
                    rounded-button px-2 py-0 bg-danger
                    rounded-button--short col-auto`}
                    onClick={this.deleteQuestion}
                    > <FA name="trash"/> </button>
            </div>
        )
    }
}

export default CustomQuestion;