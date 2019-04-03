import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Redirect, RouteComponentProps} from 'react-router-dom';

import {loginUser} from '~/auth/user/actions';

import Login from '~/auth/user/Login';
import AlertPage, { AlertPageState, PageAlert, AlertType } from './AlertPage';
import { ApplicationState } from '~/reducers';

interface StateProps {
  loginError: string;
}

interface DispatchProps {
  loginUser: (...args: any) => Promise<any>;
}

interface LoginPageProps {
}

type Props = RouteComponentProps & StateProps & DispatchProps & LoginPageProps;

interface LoginPageState extends AlertPageState {
  redirectToReferrer: boolean;
}

class LoginPage extends AlertPage<Props, LoginPageState> {
  state: Readonly<LoginPageState> = {
    alerts: [],
    redirectToReferrer: false,
  };

  constructor(props: Props) {
    super(props);

    if (props.location.hash === '#confirmed') {
      this.state = {
        alerts: [...this.state.alerts, {
          type: AlertType.Success,
          message: 'You have successfully confirmed your account',
        } as PageAlert],
        redirectToReferrer: this.state.redirectToReferrer,
      };
    }
  }

  loginUser = (formProps: any) => {
    const {loginUser, history} = this.props;
    return loginUser(formProps)
      .then(() => history.push('/'))
      .catch((e) => {
        console.error('Could not log in', e);
      });
  }

  render() {
    const {from} = this.props.location.state || {from: {pathname: '/'}};
    const {redirectToReferrer} = this.state;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    const {loginError} = this.props;

    return (
      <Login
        loginUser={this.loginUser}
        errorMessage={loginError}
        alerts={this.state.alerts ? this.state.alerts : []}
      />
    );
  }
}

const mapStateToProps = (state: ApplicationState) => {
  return {
    loginError: state.user.auth.error,
  };
};

export default connect(mapStateToProps, {loginUser})(withRouter(LoginPage));
