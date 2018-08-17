import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadAllPublicEvents, loadUserEvents} from '~/actions';

import Hero from '~/components/Hero';

import CurrentEvents from './components/CurrentEvents';
import UserEvents from './components/UserEvents';

class HomePage extends React.Component {
  static propTypes = {
    events: PropTypes.object,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    loadAllPublicEvents: PropTypes.func.isRequired,
    loadUserEvents: PropTypes.func.isRequired,
    userEvents: PropTypes.object,
    authenticated: PropTypes.bool
  };

  componentWillMount() {
    this.props.showLoading();
  }

  componentDidMount() {
    Promise.all([this.props.loadAllPublicEvents(),
      this.optionalLoadUserEvents()])
      .catch(console.error)
      .finally(this.props.hideLoading);
  }

  /**
   * Ensures the user is authenticated before trying to load their events.
   */
  optionalLoadUserEvents() {
    if (this.props.authenticated) {
      return this.props.loadUserEvents();
    }
    return true;
  }

  userEvents(events) {
    return (
      <div className="col-md-4">
        <UserEvents events={events} />
      </div>
    );
  }

  currentEvents(events, small=false) {
    return (<div className={small ? 'col-md-8' : 'col-12'}>
      <CurrentEvents small events={events} />
    </div>);
  }

  render() {
    let {events, userEvents} = this.props;

    let showSidebar = Object.values(userEvents).length > 0;

    let currentEvents = [];
    if (events) {
      let userEventNames = Object.values(userEvents).map(event => event.name);
      currentEvents = Object.values(events).filter(event =>
        new Date(event.closeTime) > new Date() &&
        userEventNames.indexOf(event.name) === -1
      );
    }

    return (
      <div className="page home-page">
        <Hero />
        <div className="home-page__contents container">
          <div className="row">
            {showSidebar && this.userEvents(Object.values(userEvents))}
            {this.currentEvents(currentEvents, showSidebar)}
          </div>
        </div>
      </div>);
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    userEvents: state.user.events,
    authenticated: state.user.auth.authenticated
  };
};

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllPublicEvents: bindActionCreators(loadAllPublicEvents, dispatch),
    loadUserEvents: bindActionCreators(loadUserEvents, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
