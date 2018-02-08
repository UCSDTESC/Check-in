import {Switch, Route} from 'react-router-dom';
import {Cookies, withCookies} from 'react-cookie';
import PropTypes, {instanceOf} from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import {AUTH_USER} from './auth/actions/types';

import AdminLayout from './layouts/admin';
import SponsorLayout from './layouts/sponsor';

import HomePage from './pages/HomePage';
import ApplyPage from './pages/ApplyPage';
import Dashboard from './pages/DashboardPage';

import Logout from './auth/Logout';

import CookieTypes from '~/static/Cookies';

class Routes extends React.Component {
	static propTypes = {
    dispatch: PropTypes.func.isRequired,
    cookies: instanceOf(Cookies).isRequired
	};
	
	constructor(props) {
		super(props);
	
		// Check initial authentication
		const {cookies} = this.props;
		if (cookies.get(CookieTypes.admin.token)) {
			props.dispatch({
				type: AUTH_USER,
				payload: cookies.get(CookieTypes.admin.user)
			});
		}
	}
	
	/**
	 * Render a route with the Administrator layout.
	 * @param {Component} Component The child component to render within the
	 * layout.
	 * @returns {Component}
	 */
	renderAdmin = (Component) => {
		let component = <Component />;
		return () =>
			(<AdminLayout>
				{component}
			</AdminLayout>);
	}
	
	/**
	 * Render a route with the Sponsor layout.
	 * @param {Component} Component The child component to render within the
	 * layout.
	 * @returns {Component}
	 */
	renderSponsor = (Component) => {
		let component = <Component />;
		return () =>
			(<SponsorLayout>
				{component}
			</SponsorLayout>);
	}

	routes() {
		return (
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route path="/register" component={ApplyPage} />

				<Route exact path="/admin/"
          component={this.renderAdmin(Dashboard)} />
				<PrivateRoute path="/admin/logout"
          component={this.renderAdmin(Logout)} />
			</Switch>
		);
	}

	render() {
		return this.routes();
	}
}

export default withRouter(connect()(withCookies(Routes)));