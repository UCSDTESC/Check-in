import React from 'react';
import PropTypes from 'prop-types';

import Forgot from '~/auth/user/Forgot';

import {forgotPassword} from '~/data/User';

class ForgotPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      success: ''
    };
  }

  sendForgotPassword = (values) => {
    if (!values.email) {
      return false;
    }

    return forgotPassword(values.email)
      .then(() => this.setState(
        {success: 'Your password reset has been sent to ' + 'your email'}))
      .catch((e) => this.setState({error: e.message}));
  };

  render() {
    return (
      <Forgot onSubmit={this.sendForgotPassword}
        errorMessage={this.state.error}
        successMessage={this.state.success} />
    );
  }
}

export default ForgotPage;
