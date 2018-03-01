import React from 'react';
import PropTypes from 'prop-types';

import Reset from '~/auth/user/Reset';

import {resetPassword} from '~/data/User';

class ResetPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      success: ''
    };
  }

  resetPassword = (values) => {
    if (!values.password || !values.passwordRepeat) {
      return false;
    }

    if (values.password !== values.passwordRepeat) {
      this.setState({error: 'Your new passwords didn\'t match'});
      return false;
    }

    return resetPassword(this.props.match.params.id, values.password)
      .then(() => this.setState({success: 'Your password has been reset'}))
      .catch((e) => this.setState({error: e.message}));
  };

  render() {
    return (
      <Reset onSubmit={this.resetPassword}
        errorMessage={this.state.error}
        successMessage={this.state.success} />
    );
  }
}

export default ResetPage;
