import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Event as EventPropType} from '~/proptypes';
import {Field, reduxForm} from 'redux-form';

class EventData extends Component {
    static propTypes = {
        event: PropTypes.shape(EventPropType).isRequired,
        handleSubmit: PropTypes.func.isRequired
    };

    render() {

        const {handleSubmit, event} = this.props;

        return (
            <form onSubmit={handleSubmit} className="sd-form">
                <h2>Event Metadata</h2>
            </form>
        )
    }
}

export default reduxForm({
    form: 'eventDataForm'
})(EventData);