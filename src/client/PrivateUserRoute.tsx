import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { ApplicationState } from './reducers';

interface StateProps {

  // Is the current user authenticated.
  authenticated: boolean;

  // Is there an authentication process in progress - this is used to prevent
  // race conditions.
  authFinished: boolean;
}

interface PrivateUserRouteProps {
  component: (props: any) => JSX.Element;
  path: string;
}

type Props = RouteProps & StateProps & PrivateUserRouteProps;

/**
 * Lock down a view by authentication state.
 */
class PrivateUserRoute extends React.Component<Props> {
  render() {
    return (
      <Route
        path={this.props.path}
        render={props => {
          if (this.props.authFinished && !this.props.authenticated) {
            return (<Redirect
              to={
                {
                  pathname: '/login',
                  state: {from: props.location},
                }
              }
            />);
          }

          return <this.props.component {...props}/>;
        }}
      />
    );
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    authenticated: state.user.auth.authenticated,
    authFinished: state.user.auth.authFinished,
  };
}

export default connect(mapStateToProps)(PrivateUserRoute);
