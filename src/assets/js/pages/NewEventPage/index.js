import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import createValidator from './validate';
import {registerNewEvent} from '~/data/Api'
import NewEventForm from './components/NewEventForm'

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

    this.createNewEvent = this.createNewEvent.bind(this);
  }

  createNewEvent(event) {
    registerNewEvent(event)
      .then((res) => {
        console.log("res");
        this.setState({
          error: null,
          event: res
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          error: err,
          event: null
        })
      });
  }

  renderAlert() {
    if (this.state.event) {
      return (
        <h3 className="text-success">Created The {this.state.event.name} Event!</h3>
      )
    }
    else if (this.state.error) {
      <h3 className="text-danger">Something Went Wrong: {this.state.error.message}</h3>
    }
  }

  render() {
    let validator = createValidator();
    return (
      <div className="page page--admin">
        <div className="sd-form__header-text text-center mt-3 mb-5">
          <h1>Create A New Event</h1>
          {this.renderAlert()}
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

function mapStateToProps(state) {
  return {

  };
};

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewEventPage);
