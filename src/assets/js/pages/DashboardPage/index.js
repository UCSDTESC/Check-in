import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import {Button} from 'reactstrap';

import {replaceEvents} from './actions';
import EventList from './components/EventList';

import {loadAllEvents} from '~/data/Api';

import {Event as EventPropType} from '~/proptypes';

class DashboardPage extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape(
      EventPropType
    ).isRequired).isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    replaceEvents: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired
  };

  loadEvents = () =>
    loadAllEvents()
    .then(res => {
      this.props.hideLoading();
      return this.props.replaceEvents(res);
    })
    .catch(console.error);

  componentWillMount() {
    this.props.showLoading();

    this.loadEvents();
  }

  render() {
    let {events} = this.props;

    return (
      <div>
        <div className="container-fluid">
          <h1>Dashboard</h1>
          <EventList events={events} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.admin.events,
    editing: state.admin.general.editing
  };
};

function mapDispatchToProps(dispatch) {
  return {
    replaceEvents: bindActionCreators(replaceEvents, dispatch),
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
