import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadAllAdminEvents, ApplicationDispatch} from '~/actions';

import {Role, getRole} from '~/static/Roles';

import AdminDashboard from './components/AdminDashboard';
import CheckinDashboard from './components/CheckinDashboard';
import SponsorDashboard from './components/SponsorDashboard';
import { ApplicationState } from '~/reducers';

const mapStateToProps = (state: ApplicationState) => ({
  events: state.admin.events,
  editing: state.admin.general.editing,
  user: state.admin.auth.user,
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  showLoading,
  hideLoading,
  loadAllAdminEvents,
}, dispatch);

interface DashboardPageProps {
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & DashboardPageProps;

class DashboardPage extends React.Component<Props> {
  componentDidMount() {
    this.props.showLoading();

    this.props.loadAllAdminEvents()
      .catch(console.error)
      .finally(this.props.hideLoading);
  }

  render() {
    const {events, user} = this.props;
    const checkinUser = !!user.checkin;

    return (
      <div className="page page--admin dashboard-page">
        <div className="container-fluid">
          <h1>Dashboard</h1>

          {checkinUser && <CheckinDashboard />}
          {getRole(user.role) >= getRole(Role.ROLE_ADMIN) &&
            <AdminDashboard events={Object.values(events)} user={user} />}
          {getRole(user.role) === getRole(Role.ROLE_SPONSOR) &&
            <SponsorDashboard events={Object.values(events)} />}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);