import React from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

import HomePage from './pages/HomePage';

export default class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={HomePage} />
				</Switch>
			</Router>
		);
	}
}
