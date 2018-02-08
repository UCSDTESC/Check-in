import PropTypes, {instanceOf} from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {getRole, Roles} from '~/static/Roles';

class DashboardPage extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    stats: PropTypes.object.isRequired
  };

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
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.admin.auth,
    user: state.admin.auth.user
  };
}

export default connect(mapStateToProps)(DashboardPage);
