import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Reset, { ResetFormData } from '~/auth/user/Reset';
import { resetPassword } from '~/data/UserApi';

interface ResetPageState {
  error: string;
  success: string;
}

type Props = RouteComponentProps<{
  resetString: string;
}>;

/**
 * Password Reset Page
 */
class ResetPage extends React.Component<Props, ResetPageState> {
  state: Readonly<ResetPageState> = {
    error: '',
    success: '',
  };

  resetPassword = (values: ResetFormData) => {
    if (!values.newPassword || !values.repeatNewPassword) {
      return {
        newPassword: 'Required',
        repeatNewPassword: 'Required',
      };
    }

    if (values.newPassword !== values.repeatNewPassword) {
      this.setState({ error: 'Your new passwords didn\'t match' });
      return {
        repeatNewPassword: 'Your new passwords didn\'t match',
      };
    }

    return resetPassword(this.props.match.params.resetString, values.newPassword)
      .then(() => {
        this.setState({success: 'Your password has been reset'});
        this.props.history.push('/login#reset');
      })
      .catch((e) => this.setState({error: e.message}));
  }

  render() {
    return (
      <Reset
        onSubmit={this.resetPassword}
        errorMessage={this.state.error}
        successMessage={this.state.success}
      />
    );
  }
}

export default withRouter(ResetPage);
