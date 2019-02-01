import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadAllAdminEvents} from '~/actions';

import {Roles, getRole} from '~/static/Roles';

import EventList from './components/EventList';
import AdminDashboard from './components/AdminDashboard';
import CheckinDashboard from './components/CheckinDashboard';
import SponsorDashboard from './components/SponsorDashboard';

class DashboardPage extends React.Component {
  static propTypes = {
    events: PropTypes.object.isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    loadAllAdminEvents: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.showLoading();

    this.props.loadAllAdminEvents()
      .catch(console.error)
      .finally(this.props.hideLoading);
  }

  render() {
    let {events, user} = this.props;
    let checkinUser = !!user.checkin;

    return (
      <div className="page page--admin dashboard-page">
        <div className="container-fluid">
          <h1>Dashboard</h1>

          {checkinUser && <CheckinDashboard />}
          {getRole(user.role) >= getRole(Roles.ROLE_ADMIN) &&
            <AdminDashboard events={Object.values(events)} />}
          {getRole(user.role) === getRole(Roles.ROLE_SPONSOR) &&
            <SponsorDashboard events={Object.values(events)} />}
        </div>
        {getRole(user.role) >= getRole(Roles.ROLE_ADMIN) &&
        <h2 className="mt-2 event dashboard-page__btn">
          <Link to="/admin/new" className="text-white">
            +
          </Link>
        </h2>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.admin.events,
    editing: state.admin.general.editing,
    user: state.admin.auth.user
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
