import React from 'react';
import {Route, Switch} from 'react-router-dom';

import HomePage from './pages/HomePage';
import ApplyPage from './pages/ApplyPage';

class Routes extends React.Component {
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
			</Switch>
		);
	}

	render() {
		return this.routes();
	}
}

export default withRouter(connect()(withCookies(Routes)));