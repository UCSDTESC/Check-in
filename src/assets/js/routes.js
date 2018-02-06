import React from 'react';
import {Route, Switch} from 'react-router-dom';

import HomePage from './pages/HomePage';
import ApplyPage from './pages/ApplyPage';

export default (
	<Switch>
		<Route exact path="/" component={HomePage} />
		<Route path="/apply" component={ApplyPage} />
	</Switch>
);
