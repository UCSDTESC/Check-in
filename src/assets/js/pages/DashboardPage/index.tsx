import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {loadAllAdminEvents} from '~/actions';

import {Roles, getRole} from '~/static/Roles';

import AdminDashboard from './components/AdminDashboard';
import CheckinDashboard from './components/CheckinDashboard';
import SponsorDashboard from './components/SponsorDashboard';
import { ApplicationState } from '~/reducers';
import { EventsState } from '~/reducers/Admin/types';
import { Admin } from '~/static/types';

interface StateProps {
  events: EventsState;
  editing: boolean;
  user: Admin;
}

interface DispatchProps {
  showLoading: () => void;
  hideLoading: () => void;
  loadAllAdminEvents: () => Promise<any>;
}

interface DashboardPageProps {
}

type Props = StateProps & DispatchProps & DashboardPageProps;

class DashboardPage extends React.Component<Props> {
  static propTypes = {
    events: PropTypes.object.isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    loadAllAdminEvents: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
  };

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
          {getRole(user.role) >= getRole(Roles.ROLE_ADMIN) &&
            <AdminDashboard events={Object.values(events)} user={user} />}
          {getRole(user.role) === getRole(Roles.ROLE_SPONSOR) &&
            <SponsorDashboard events={Object.values(events)} />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ApplicationState) => {
  return {
    events: state.admin.events,
    editing: state.admin.general.editing,
    user: state.admin.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showLoading: bindActionCreators(showLoading, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
    loadAllAdminEvents: bindActionCreators(loadAllAdminEvents, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
