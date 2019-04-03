import {Route, Redirect, RouteProps} from 'react-router-dom';
import React from 'react';
import {connect} from 'react-redux';
import { ApplicationState } from './reducers';

interface StateProps {
  authenticated: boolean;
  authFinished: boolean;
}

interface PrivateUserRouteProps {
  component: (props: any) => JSX.Element;
  path: string;
}

type Props = RouteProps & StateProps & PrivateUserRouteProps;

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
