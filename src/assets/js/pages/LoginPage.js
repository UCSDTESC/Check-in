import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter, Redirect} from "react-router-dom";

import {loginUser} from "~/auth/user/actions";

import Login from "~/auth/user/Login";

class LoginPage extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,

    loginUser: PropTypes.func.isRequired,
    loginError: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
      redirectToReferrer: false,
    };

    if (props.location.hash === "#confirmed") {
      this.state = {
        alerts: [...this.state.alerts, {
          type: "success",
          text: "You have successfully confirmed your account",
        }],
      };
    }
  }

  loginUser = (formProps) => {
    let {loginUser, history} = this.props;
    return loginUser(formProps)
      .then(() => history.push("/"))
      .catch((e) => {
        console.error("Could not log in", e);
      });
  }

  render() {
    const {from} = this.props.location.state || {from: {pathname: "/"}};
    const {redirectToReferrer} = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    let {loginError} = this.props;

    return (
      <Login loginUser={this.loginUser} errorMessage={loginError}
        alerts={this.state.alerts ? this.state.alerts : []} />
    );
  }
}

function mapStateToProps(state) {
  return {
    loginError: state.user.auth.error,
  };
}

export default connect(mapStateToProps, {loginUser})(withRouter(LoginPage));
