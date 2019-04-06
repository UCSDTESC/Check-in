import {Switch, Route} from 'react-router-dom';
import {Cookies, withCookies} from 'react-cookie';
import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import ReactGA from 'react-ga';
// tslint:disable-next-line:no-submodule-imports
import {hot} from 'react-hot-loader/root';

import PrivateRoute from './PrivateRoute';
import PrivateUserRoute from './PrivateUserRoute';
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
import NotFoundPage from './pages/NotFound';

import {authorised as AdminAuthorised} from '~/data/Api';

import {authorised as UserAuthorised, JWTAuthUser} from '~/data/User';

import CookieTypes from '~/static/Cookies';
import { ApplicationDispatch } from './actions';
import { bindActionCreators, compose } from 'redux';
import { finishAuthorisation, authoriseAdmin } from './auth/admin/actions';
import { connect } from 'react-redux';
import { JWTAuthAdmin } from './data/AdminAuth';
import { authoriseUser, finishAuthorisation as finishUserAuth } from './auth/user/actions';

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  authoriseAdmin,
  authoriseUser,
  finishAuthorisation,
  finishUserAuth,
}, dispatch);

interface RoutesProps {
  cookies: Cookies;
}

type Props = RouteComponentProps & ReturnType<typeof mapDispatchToProps> & RoutesProps;

class Routes extends React.Component<Props> {
  componentDidMount() {
    const {authoriseAdmin, authoriseUser, finishAuthorisation, finishUserAuth} = this.props;

    // Check initial authentication
    const {cookies} = this.props;

    if (cookies.get(CookieTypes.admin.token)) {
      // Verify the JWT Token is still valid
      AdminAuthorised()
        .then(() => {
          const authCookie: unknown = cookies.get(CookieTypes.admin.user);
          return authoriseAdmin(authCookie as JWTAuthAdmin);
        })
        .catch(console.error);
    } else {
      finishAuthorisation();
    }

    if (cookies.get(CookieTypes.user.token)) {
      // Verify the user JWT Token is still valid
      UserAuthorised()
        .then(() => {
          // TODO : Remove JSON Parse - Use a better library for Cookies
          const authCookie: unknown = cookies.get(CookieTypes.user.user);
          return authoriseUser(authCookie as JWTAuthUser);
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
