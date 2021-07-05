import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { ApplicationDispatch } from '~/actions';
import Login from '~/auth/user/Login';
import { LoginFormData } from '~/auth/user/Login';
import { loginUser } from '~/auth/user/actions';
import { ApplicationState } from '~/reducers';

import AlertPage, { AlertPageState, PageAlert, AlertType } from './AlertPage';

const mapStateToProps = (state: ApplicationState) => ({
  loginError: state.user.auth.error,
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  loginUser,
}, dispatch);

interface LoginPageProps {
}

type Props = RouteComponentProps & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & LoginPageProps;

interface LoginPageState extends AlertPageState {
  redirectToReferrer: boolean;
}

/**
 * Page for users to login to their accounts.
 */
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
    } else if (props.location.hash === '#reset') {
      this.state = {
        alerts: [...this.state.alerts, {
          type: AlertType.Success,
          message: 'You have successfully reset your password',
        } as PageAlert],
        redirectToReferrer: this.state.redirectToReferrer,
      };
    }
  }

  /**
   * Make API call for the user trying to log in.
   * 
   * @param {LoginFormData} formProps The data in the form.
   */
  loginUser = (formProps: LoginFormData) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginPage));
