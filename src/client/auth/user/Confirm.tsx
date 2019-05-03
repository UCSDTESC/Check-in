import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { confirmAccount } from '~/data/Api';

type RouteProps = RouteComponentProps<{
  accountId: string;
}>;

type ConfirmProps = RouteProps;

class ConfirmPage extends React.Component<ConfirmProps> {
  componentDidMount() {
    const {accountId} = this.props.match.params;
    confirmAccount(accountId)
      .then(() => this.props.history.push('/login#confirmed'));
  }

  render() {
    return <></>;
  }
}

export default withRouter(ConfirmPage);
