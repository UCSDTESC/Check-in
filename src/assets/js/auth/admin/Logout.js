import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import {logoutUser} from './actions';

class LogoutPage extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.dispatch(logoutUser());
  }

  render() {
    return null;
  }
}

export default withRouter(connect()(LogoutPage));
