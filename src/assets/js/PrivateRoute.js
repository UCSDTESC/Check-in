import {Route, Redirect} from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class PrivateRoute extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authFinished: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired
  };

  render() {
    return (
      <Route path={this.props.path} render={props => {
        if (this.props.authFinished && !this.props.authenticated) {
          return (<Redirect to={{
            pathname: '/admin',
            state: {from: props.location}
          }}/>);
        }

        return <this.props.component {...props}/>;
      }
      }/>
    );
  }
};

function mapStateToProps(state) {
  return {
    authenticated: state.admin.auth.authenticated,
    authFinished: state.admin.auth.authFinished
  };
}

export default connect(mapStateToProps)(PrivateRoute);
