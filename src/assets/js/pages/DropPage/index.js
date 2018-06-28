import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import CurrentEvents from './components/CurrentEvents';

import NavHeader from '~/components/NavHeader';

import {loadAllPublicDropEvents} from '~/actions';

class DropPage extends React.Component {
  static propTypes = {
    events: PropTypes.array,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    loadAllPublicDropEvents: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      dropEvents: []
    };
  }

  componentWillMount() {
    this.props.showLoading();

    this.props.loadAllPublicDropEvents()
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
      <div>
        <NavHeader />
        <div className="page home-page">
          <div className="home-page__contents">
            {currentEvents.length > 0 && <CurrentEvents events={currentEvents} />}
            {currentEvents.length === 0 && (
              <div className="container">
                <div className="row">
                  <div className="col">
                    <h2>No Upcoming Events</h2>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>);
  }
}

function mapStateToProps(state) {
  return {
    events: state.events.dropEvents
  };
};

function mapDispatchToProps(dispatch) {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllPublicDropEvents: bindActionCreators(loadAllPublicDropEvents, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DropPage);
