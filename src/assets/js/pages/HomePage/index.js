import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadAllPublicEvents} from '~/actions';

import Hero from '~/components/Hero';

import CurrentEvents from './components/CurrentEvents';

class HomePage extends React.Component {
  static propTypes = {
    events: PropTypes.object,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    loadAllPublicEvents: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.showLoading();

    this.props.loadAllPublicEvents()
      .catch(console.error)
      .finally(this.props.hideLoading);
  }

  render() {
    let {events} = this.props;

    let currentEvents = [];
    if (events) {
      currentEvents = Object.values(events).filter(event =>
        new Date(event.closeTime) > new Date()
      );
    }

    return (
      <div className="page home-page">
        <Hero />
        <div className="home-page__contents">
          {currentEvents.length > 0 && <CurrentEvents events={currentEvents} />}
          {currentEvents.length === 0 && <p>No Current Events</p>}
        </div>
      </div>);
  }
}

function mapStateToProps(state) {
  return {
    events: state.events
  };
};

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllPublicEvents: bindActionCreators(loadAllPublicEvents, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
