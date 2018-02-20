import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadAllAdminEvents} from '~/actions';

import EventList from './components/EventList';

class DashboardPage extends React.Component {
  static propTypes = {
    events: PropTypes.object.isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    loadAllAdminEvents: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired
  };

  componentWillMount() {
    this.props.showLoading();

    this.props.loadAllAdminEvents()
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
    loadAllAdminEvents: bindActionCreators(loadAllAdminEvents, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
