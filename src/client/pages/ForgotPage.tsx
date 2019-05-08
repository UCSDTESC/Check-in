import React from 'react';
import { InjectedFormProps, FormErrors } from 'redux-form';
import Forgot, { ForgotFormData } from '~/auth/user/Forgot';
import { forgotPassword } from '~/data/User';

interface ForgotPageState {
  error: string;
  success: string;
}

class ForgotPage extends React.Component<InjectedFormProps, ForgotPageState> {
  state: Readonly<ForgotPageState> = {
    error: '',
    success: '',
  };

  sendForgotPassword = (values: ForgotFormData) => {
    if (!values.email) {
      return {
        email: 'Required',
      } as FormErrors<ForgotFormData>;
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
