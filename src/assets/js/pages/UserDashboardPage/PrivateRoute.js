import {Route, Redirect} from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class PrivateRoute extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired
  };

  render() {
    return (
      <Route path={this.props.path} render={props => (
        this.props.authenticated ? (
          <this.props.component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/user/login',
            state: {from: props.location}
          }}/>
        )
      )}/>
    );
  }
};

function mapStateToProps(state) {
  return {
    authenticated: state.user.auth.authenticated
  };
}

export default connect(mapStateToProps)(PrivateRoute);
