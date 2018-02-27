import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {loginUser} from '~/auth/user/actions';

import Login from '~/auth/user/Login';

class LoginPage extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,

    loginUser: PropTypes.func.isRequired,
    loginError: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      alerts: []
    };

    if (props.location.hash === '#confirmed') {
      this.state = {
        alerts: [...this.state.alerts, {
          type: 'success',
          text: 'You have successfully confirmed your account'
        }]
      };
    }
  };

  loginUser = (formProps) => {
    let {loginUser, history} = this.props;
    return loginUser(formProps)
      .then(() => history.push('/user'))
      .catch((e) => {
        console.error('Could not log in', e);
      });
  };

  render() {
    let {loginError} = this.props;

    return (
      <Login loginUser={this.loginUser} errorMessage={loginError}
        alerts={this.state.alerts ? this.state.alerts : []} />
    );
  }
}

function mapStateToProps(state) {
  return {
    user: null /*state.user.auth.user*/,
    loginError: null/*state.user.auth.error*/
  };
};

export default connect(mapStateToProps, {loginUser})(withRouter(LoginPage));
