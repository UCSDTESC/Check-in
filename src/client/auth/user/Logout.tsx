import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import { ApplicationDispatch } from '~/actions';

import { logoutUser } from './actions';

const mapDispatchToProps = (dispatch: ApplicationDispatch) =>
  bindActionCreators({
    logoutUser,
  }, dispatch);

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class LogoutPage extends React.Component<Props> {
  componentDidMount() {
    this.props.logoutUser();
  }

  render() {
    return <></>;
  }
}

export default withRouter(connect(null, mapDispatchToProps)(LogoutPage));
