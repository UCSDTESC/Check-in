import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import createValidator from './validate';
import registerNewEvent from '~/data/Api'
import NewEventForm from './components/NewEventForm'

class NewEventPage extends React.Component {
  static propTypes = {
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.createNewEvent = this.createNewEvent.bind(this);
  }

  componentWillMount() {
  }

  createNewEvent(e) {
    registerNewEvent()
  }

  render() {
    let validator = createValidator();
    return (
      <div className="page page--admin">
        <h1 className="sd-form__header-text text-center mt-3 mb-5">Create A New Event</h1>
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
