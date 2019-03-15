import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import {UncontrolledAlert} from 'reactstrap';

import {addEventAlert} from '../EventPage/actions';

import createValidator from './validate';

import {registerNewEvent} from '~/data/Api';

import NewEventForm from './components/NewEventForm';

class NewEventPage extends React.Component {
  static propTypes = {
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    addEventAlert: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      err: null
    };
  }

  createNewEvent = (event) => {
    registerNewEvent(event)
      .then((res) => {
        this.setState({err: null});
        this.props.addEventAlert(res.alias, `Successfully Created ${res.name}`,
          'success', 'Create Event');
        this.props.history.push('/admin/events/' + res.alias);
      })
      .catch((err) => {
        this.setState({err: err.message});
      });
  }

  render() {
    let validator = createValidator();
    return (
      <div className="page page--admin">
        <div className="event-page__above">
          {this.state.err && <UncontrolledAlert color="danger">
            {this.state.err}
          </UncontrolledAlert>}
        </div>
        <div className="sd-form__header-text text-center mt-3 mb-5">
          <h1>Create A New Event</h1>
        </div>

        <div className="sd-form__wrapper">
          <div className="sd-form">
            <NewEventForm validate={validator} onSubmit={this.createNewEvent}
              initialValues={{organisedBy: 'TESC'}}/>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    addEventAlert: bindActionCreators(addEventAlert, dispatch)
  };
};

export default withRouter(connect(null, mapDispatchToProps)(NewEventPage));
