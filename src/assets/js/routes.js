import {Switch, Route} from 'react-router-dom';
import {Cookies, withCookies} from 'react-cookie';
import PropTypes, {instanceOf} from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import ReactGA from 'react-ga';

import PrivateRoute from './PrivateRoute';
import PrivateUserRoute from './PrivateUserRoute';
import {AUTH_USER as AUTH_ADMIN} from './auth/admin/actions/types';
import {AUTH_USER} from './auth/user/actions/types';
import AdminLayout from './layouts/admin';
import SponsorLayout from './layouts/sponsor';
import UserLayout from './layouts/user';
import HomePage from './pages/HomePage';
import ApplyPage from './pages/ApplyPage';
import Dashboard from './pages/DashboardPage';
import AdminsPage from './pages/AdminsPage';
import EventPage from './pages/EventPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ResetPage from './pages/ResetPage';
import ForgotPage from './pages/ForgotPage';
import UserPage from './pages/UserPage';
import AdminLogout from './auth/admin/Logout';
import UserLogout from './auth/user/Logout';
import CheckinPage from './pages/CheckinPage';
import ResumesPage from './pages/ResumesPage';
import NewEventPage from './pages/NewEventPage';

import CookieTypes from '~/static/Cookies';

class Routes extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    cookies: instanceOf(Cookies).isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // Check initial authentication
    const {cookies} = this.props;
    if (cookies.get(CookieTypes.admin.token)) {
      props.dispatch({
        type: AUTH_ADMIN,
        payload: cookies.get(CookieTypes.admin.user)
      });
    }

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
   * Render a route with the Administrator layout.
   * @param {Component} Component The child component to render within the
   * layout.
   * @returns {Component}
   */
  renderAdmin = (Component) => {
    return (props) =>
      (<AdminLayout>
        <Component match={props.match} />
      </AdminLayout>);
  }

  /**
   * Render a route with the Sponsor layout.
   * @param {Component} Component The child component to render within the
   * layout.
   * @returns {Component}
   */
  renderSponsor = (Component) => {
    return (props) =>
      (<SponsorLayout>
        <Component match={props.match} />
      </SponsorLayout>);
  }

  renderUser = (Component) => {
    return (props) =>
      (<UserLayout>
        <Component match={props.match} />
      </UserLayout>);
  }

  routes() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/register/:eventAlias" component={ApplyPage} />
        <Route exact path="/admin/"
          component={this.renderAdmin(Dashboard)} />
        <PrivateRoute path="/admin/logout"
          component={this.renderAdmin(AdminLogout)} />
        <PrivateRoute path="/admin/admins"
          component={this.renderAdmin(AdminsPage)} />
        <PrivateRoute path="/admin/new"
          component={this.renderAdmin(NewEventPage)} />

        {/* Event Specific Routes */}
        <PrivateRoute path="/admin/events/:eventAlias"
          component={this.renderAdmin(EventPage)} />
        <PrivateRoute path="/admin/users/:eventAlias"
          component={this.renderAdmin(UsersPage)} />
        <PrivateRoute path="/admin/checkin/:eventAlias"
          component={this.renderAdmin(CheckinPage)} />
        <PrivateRoute path="/admin/resumes/:eventAlias"
          component={this.renderSponsor(ResumesPage)} />

        {/* User Routes */}
        <Route exact path="/login" component={this.renderUser(LoginPage)} />
        <Route exact path="/user/forgot"
          component={this.renderUser(ForgotPage)} />
        <Route path="/user/reset/:id" component={this.renderUser(ResetPage)} />

        <PrivateUserRoute exact path="/logout"
          component={this.renderUser(UserLogout)} />
        <PrivateUserRoute exact path="/user/:eventAlias"
          component={this.renderUser(UserPage)} />
      </Switch>
    );
  }

  render() {
    return this.routes();
  }
}

export default withRouter(connect()(withCookies(Routes)));
