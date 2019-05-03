import { JWTAdminAuthToken, JWTUserAuthToken } from '@Shared/api/Responses';
import React, { Component } from 'react';
import { Cookies, withCookies } from 'react-cookie';
import ReactGA from 'react-ga';
// tslint:disable-next-line:no-submodule-imports
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { authorised as AdminAuthorised } from '~/data/Api';
import { authorised as UserAuthorised } from '~/data/User';
import CookieTypes from '~/static/Cookies';

import PrivateRoute from './PrivateRoute';
import PrivateUserRoute from './PrivateUserRoute';
import { ApplicationDispatch } from './actions';
import AdminLogout from './auth/admin/Logout';
import { finishAuthorisation, authoriseAdmin, logoutAdmin } from './auth/admin/actions';
import ConfirmPage from './auth/user/Confirm';;
import UserLogout from './auth/user/Logout';
import { authoriseUser, finishAuthorisation as finishUserAuth, logoutUser } from './auth/user/actions';
import AdminLayout from './layouts/admin';
import SponsorLayout from './layouts/sponsor';
import UserLayout from './layouts/user';
import AdminsPage from './pages/AdminsPage';
import ApplyPage from './pages/ApplyPage';
import CheckinPage from './pages/CheckinPage';
import Dashboard from './pages/DashboardPage';
import EventPage from './pages/EventPage';
import ForgotPage from './pages/ForgotPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NewEventPage from './pages/NewEventPage';
import NotFoundPage from './pages/NotFound';
import ResetPage from './pages/ResetPage';
import ResumesPage from './pages/ResumesPage';
import UserPage from './pages/UserPage';
import UsersPage from './pages/UsersPage';

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  authoriseAdmin,
  authoriseUser,
  finishAuthorisation,
  finishUserAuth,
  logoutAdmin,
  logoutUser,
}, dispatch);

interface RoutesProps {
  cookies: Cookies;
}

type Props = RouteComponentProps & ReturnType<typeof mapDispatchToProps> & RoutesProps;

class Routes extends React.Component<Props> {
  componentDidMount() {
    const {authoriseAdmin, authoriseUser, finishAuthorisation, finishUserAuth,
           logoutAdmin, logoutUser} = this.props;

    // Check initial authentication
    const {cookies} = this.props;

    if (cookies.get(CookieTypes.admin.token)) {
      // Verify the JWT Token is still valid
      AdminAuthorised()
        .then(() => {
          const authCookie: unknown = cookies.get(CookieTypes.admin.user);
          return authoriseAdmin(authCookie as JWTAdminAuthToken);
        })
        .catch(() => {
          logoutAdmin();
        });
    } else {
      finishAuthorisation();
    }

    if (cookies.get(CookieTypes.user.token)) {
      // Verify the user JWT Token is still valid
      UserAuthorised()
        .then(() => {
          // TODO : Remove JSON Parse - Use a better library for Cookies
          const authCookie: unknown = cookies.get(CookieTypes.user.user);
          return authoriseUser(authCookie as JWTUserAuthToken);
        })
        .catch(() => {
          logoutUser();
        });
    } else {
      // Finish auth process
      finishUserAuth();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  /**
   * Update the Google analytics to set the current page.
   */
  onRouteChanged() {
    const {location} = this.props;
    ReactGA.set({page: location.pathname + location.search});
    ReactGA.pageview(location.pathname + location.search);
  }

  /**
   * Render a route with the Administrator layout.
   * @param {JSX.IntrinsicElements} component The child component to render within the
   * layout.
   * @returns {Component}
   */
  renderAdmin = (RenderComponent: any) => {
    return (props: RouteComponentProps) =>
      (
        <AdminLayout>
          <RenderComponent match={props.match} />
        </AdminLayout>
      );
  }

  /**
   * Render a route with the Sponsor layout.
   * @param {JSX.IntrinsicElements} component The child component to render within the
   * layout.
   * @returns {Component}
   */
  renderSponsor = (RenderComponent: any) => {
    return (props: RouteComponentProps) =>
      (
        <SponsorLayout>
          <RenderComponent match={props.match} />
        </SponsorLayout>
      );
  }

  renderUser = (RenderComponent: any) => {
    return (props: RouteComponentProps) =>
      (
        <UserLayout>
          <RenderComponent match={props.match} />
        </UserLayout>
      );
  }

  routes() {
    return (
      <Switch>
        <Route
          exact={true}
          path="/"
          component={HomePage}
        />
        <Route
          path="/register/:eventAlias"
          component={ApplyPage}
        />
        <Route
          exact={true}
          path="/admin/"
          component={this.renderAdmin(Dashboard)}
        />
        <PrivateRoute
          path="/admin/logout"
          component={this.renderAdmin(AdminLogout)}
        />
        <PrivateRoute
          path="/admin/admins"
          component={this.renderAdmin(AdminsPage)}
        />
        <PrivateRoute
          path="/admin/new"
          component={this.renderAdmin(NewEventPage)}
        />

        {/* Event Specific Routes */}
        <PrivateRoute
          path="/admin/events/:eventAlias"
          component={this.renderAdmin(EventPage)}
        />
        <PrivateRoute
          path="/admin/users/:eventAlias"
          component={this.renderAdmin(UsersPage)}
        />
        <PrivateRoute
          path="/admin/checkin/:eventAlias"
          component={this.renderAdmin(CheckinPage)}
        />
        <PrivateRoute
          path="/admin/resumes/:eventAlias"
          component={this.renderSponsor(ResumesPage)}
        />

        {/* User Routes */}

        <Route
          exact={true}
          path="/login"
          component={this.renderUser(LoginPage)}
        />
        <Route
          exact={true}
          path="/user/forgot"
          component={this.renderUser(ForgotPage)}
        />
        <Route
          path="/user/reset/:id"
          component={this.renderUser(ResetPage)}
        />
        <Route
          path="/user/confirm/:accountId"
          component={this.renderUser(ConfirmPage)}
        />

        <PrivateUserRoute
          exact={true}
          path="/logout"
          component={this.renderUser(UserLogout)}
        />
        <PrivateUserRoute
          exact={true}
          path="/user/:eventAlias"
          component={this.renderUser(UserPage)}
        />

        {/* Not-Found Route */}
        <Route component={NotFoundPage} />
      </Switch>
    );
  }

  render() {
    return this.routes();
  }
}

export default compose(
  hot,
  withRouter,
  withCookies,
  connect(null, mapDispatchToProps),
)(Routes) as React.ComponentType;
