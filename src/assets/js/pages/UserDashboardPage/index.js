import {Switch, Route} from 'react-router-dom';
import {Cookies, withCookies} from 'react-cookie';
import PropTypes, {instanceOf} from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import ReactGA from 'react-ga';

import {AUTH_USER} from './pages/auth/actions/types';
import PrivateRoute from './PrivateRoute';
import LoginPage from './pages/LoginPage';
import ForgotPage from './pages/ForgotPage';
import ResetPage from './pages/ResetPage';
import Logout from './pages/auth/Logout';
import UserPage from './pages/UserPage/index';

import CookieTypes from '~/static/Cookies';

import NavHeader from '~/components/NavHeader';

class UserDashboardPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    cookies: instanceOf(Cookies).isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // Check initial authentication
    const {cookies} = this.props;
    if (cookies.get(CookieTypes.user.token)) {
      props.dispatch({
        type: AUTH_USER,
        payload: cookies.get(CookieTypes.user.user)
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  /**
   * Update the Google analytics to set the current page.
   */
  onRouteChanged() {
    let {location} = this.props;
    ReactGA.set({page: location.pathname + location.search});
    ReactGA.pageview(location.pathname + location.search);
  }

  /**
   * The routes for the /user route.
   */
  routes() {
    return (
      <div className="page max-height">
        <NavHeader />
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/user/forgot" component={ForgotPage} />
          <Route path="/user/reset/:id" component={ResetPage} />

          <PrivateRoute exact path="/user" component={UserPage} />
          <PrivateRoute exact path="/user/logout" component={Logout} />
        </Switch>
      </div>
    );
  }

  render() {
    return this.routes();
  }
}

export default withRouter(connect()(withCookies(UserDashboardPage)));
