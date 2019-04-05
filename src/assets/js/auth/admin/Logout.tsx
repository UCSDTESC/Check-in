import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router';

import {logoutUser} from './actions';
import { ApplicationDispatch } from '~/actions';
import { bindActionCreators } from 'redux';

const mapDispatchToProps = (dispatch: ApplicationDispatch) =>
  bindActionCreators({
    logoutUser,
  }, dispatch);

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class LogoutPage extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.logoutUser();
  }

  render() {
    return <></>;
  }
}

export default withRouter(connect(null, mapDispatchToProps)(LogoutPage));
