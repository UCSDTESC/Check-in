import React from 'react';

import Forgot from '~/auth/user/Forgot';

import {forgotPassword} from '~/data/User';
import { InjectedFormProps } from 'redux-form';

interface ForgotPageState {
  error: string;
  success: string;
}

class ForgotPage extends React.Component<InjectedFormProps, ForgotPageState> {
  state: Readonly<ForgotPageState> = {
    error: '',
    success: '',
  };

  sendForgotPassword = (values: any) => {
    if (!values.email) {
      return false;
    }

    return forgotPassword(values.email)
      .then(() => this.setState(
        {success: 'Your password reset has been sent to your email'}))
      .catch((e) => this.setState({error: e.message}));
  }

  render() {
    return (
      <Forgot
        onSubmit={this.sendForgotPassword}
        errorMessage={this.state.error}
        successMessage={this.state.success}
      />
    );
  }
}

export default ForgotPage;
