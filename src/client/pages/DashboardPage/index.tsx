import { Role, getRoleRank } from '@Shared/Roles';
import React from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { bindActionCreators } from 'redux';
import { loadAllAdminEvents, ApplicationDispatch } from '~/actions';
import { ApplicationState } from '~/reducers';

import AdminDashboard from './components/AdminDashboard';
import CheckinDashboard from './components/CheckinDashboard';
import SponsorDashboard from './components/SponsorDashboard';

const mapStateToProps = (state: ApplicationState) => ({
  events: state.admin.events,
  user: state.admin.auth.user,
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  showLoading,
  hideLoading,
  loadAllAdminEvents,
}, dispatch);

interface DashboardPageProps {
}

/**
 * This component receives props in 3 ways -
 * 1) The explicit props provied to it by DashboardPageProps
 * 2) The redux state provided to it by mapStateToProps
 * 3) The dispatch functions provided to it by mapDispatchToProps
 *
 * So, the props of this component is the union of the return types of mapStateToProps,
 * mapDispatchToProps and DashboardPageProps
 */
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & DashboardPageProps;

/**
 * This is the page that an admin sees when they first log into tesc.events.
 * It shows the list of events that admin is permitted to see
 */
class DashboardPage extends React.Component<Props> {

  componentDidMount() {
    this.props.showLoading();

    // Hide the loading state at the end of this promise
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
          {getRoleRank(user.role) >= getRoleRank(Role.ROLE_ADMIN) &&
            <AdminDashboard events={Object.values(events)} user={user} />}
          {getRoleRank(user.role) === getRoleRank(Role.ROLE_SPONSOR) &&
            <SponsorDashboard events={Object.values(events)} />}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
