import PropTypes, {instanceOf} from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {loadAllStats} from './actions';

import {getRole, Roles} from '~/static/Roles';

class DashboardPage extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    stats: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.dispatch(loadAllStats());
  }

  render() {
    let {user} = this.props;

    return (
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-sm-12">
            <h1>Dashboard</h1>
            <h2 className="text-left">
              {user.username}
              <small> ({user.role})</small>
            </h2>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Total Users</h3>
                <p className="card-text">
                  {this.props.stats.users.total.toLocaleString()}
                </p>
                {getRole(user.role) >= getRole(Roles.ROLE_ADMIN) &&
                  <Link to="/admin/users" className="btn btn-primary">
                    See Users
                  </Link>
                }
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Unique Universities</h3>
                <p className="card-text">
                  {this.props.stats.university.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.admin.auth,
    user: state.admin.auth.user,
    stats: state.admin.dashboardStats
  };
}

export default connect(mapStateToProps)(DashboardPage);
