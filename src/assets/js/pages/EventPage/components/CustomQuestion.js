import React, {Component} from 'react';

class CustomQuestion extends Component {
    render() {
        return (
            <div>{this.props.question}</div>
        )
    }
}

export default CustomQuestion;