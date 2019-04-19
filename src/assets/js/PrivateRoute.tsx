import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { ApplicationState } from './reducers';

interface StateProps {
  authenticated: boolean;
  authFinished: boolean;
}

interface PrivateRouteProps {
  component: (props: any) => JSX.Element;
  path: string;
}

type Props = RouteProps & StateProps & PrivateRouteProps;

class PrivateRoute extends React.Component<Props> {
  render() {
    return (
      <Route
        path={this.props.path}
        render={props => {
          if (this.props.authFinished && !this.props.authenticated) {
            return (<Redirect
              to={
                {
                  pathname: '/admin',
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
    authenticated: state.admin.auth.authenticated,
    authFinished: state.admin.auth.authFinished,
  };
}

export default connect<StateProps>(mapStateToProps)(PrivateRoute);
