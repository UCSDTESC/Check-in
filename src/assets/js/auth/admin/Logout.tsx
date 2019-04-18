import React from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router';

import {logoutAdmin} from './actions';
import { ApplicationDispatch } from '~/actions';
import { bindActionCreators } from 'redux';

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
