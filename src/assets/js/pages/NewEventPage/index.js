import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import createValidator from './validate';
import {registerNewEvent} from '~/data/Api'
import NewEventForm from './components/NewEventForm';
import {UncontrolledAlert} from 'reactstrap';

class NewEventPage extends React.Component {
  static propTypes = {
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      event: null
    }
  }

  createNewEvent = (event) => {
    registerNewEvent(event)
      .then((res) => {
        this.setState({
          error: null,
          event: res
        });
      })
      .catch((err) => {
        this.setState({
          error: err.message,
          event: null
        })
      });
  }

  renderAlert() {
    if (this.state.event) {
      return (
        <UncontrolledAlert color="success">
          Successfully Created <b>{this.state.event.name}</b>!
        </UncontrolledAlert>
      )
    }
    else if (this.state.error) {
      return <UncontrolledAlert color="danger">{this.state.error}</UncontrolledAlert>
    }
  }

  render() {
    let validator = createValidator();
    return (
      <div className="page page--admin">
        <div className="event-page__above">
          {this.renderAlert()}
        </div>
        <div className="sd-form__header-text text-center mt-3 mb-5">
          <h1>Create A New Event</h1>
        </div>
        
        <div className="sd-form__wrapper">
          <div className="sd-form">
            <NewEventForm validate={validator} onSubmit={this.createNewEvent} />
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
  };
};

export default connect(null, mapDispatchToProps)(NewEventPage);
