import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import {Button} from 'reactstrap';

import {loadAllEvents} from '~/actions';
import EventList from './components/EventList';

import {Event as EventPropType} from '~/proptypes';

class DashboardPage extends React.Component {
  static propTypes = {
    events: PropTypes.object.isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    loadAllEvents: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired
  };

  componentWillMount() {
    this.props.showLoading();

    this.props.loadAllEvents()
    .catch(console.error)
    .finally(this.props.hideLoading);
  }

  render() {
    let {events} = this.props;

    return (
      <div className="page page--admin dashboard-page">
        <div className="container-fluid">
          <h1>Dashboard</h1>
          <EventList events={Object.values(events)} />
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
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllEvents: bindActionCreators(loadAllEvents, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
