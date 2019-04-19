import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import { ApplicationDispatch } from '~/actions';

import { logoutAdmin } from './actions';

const mapDispatchToProps = (dispatch: ApplicationDispatch) =>
  bindActionCreators({
    logoutAdmin,
  }, dispatch);

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class LogoutPage extends React.Component<Props> {
  componentDidMount() {
    this.props.logoutAdmin();
  }

  render() {
    return <></>;
  }
}

export default withRouter(connect(null, mapDispatchToProps)(LogoutPage));
