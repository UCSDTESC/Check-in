import * as React from 'react';
import { CookiesProvider } from 'react-cookie';
import { render } from 'react-dom';
import * as ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { BrowserRouter as Router } from 'react-router-dom';
import { applyMiddleware, compose, createStore, AnyAction } from 'redux';
import reduxThunk, { ThunkMiddleware } from 'redux-thunk';

import reducer, { ApplicationState } from './reducers';
import Routes from './routes';

ReactGA.initialize('UA-123201625-1');

// Required for Redux Devtools Chrome extension
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create Redux store with middlewares
const store = createStore(reducer,
  composeEnhancers(
    applyMiddleware(reduxThunk as ThunkMiddleware<ApplicationState, AnyAction>)
  ));

// Configuring the application for routing, cookies, and redux.
render(
  (
  <CookiesProvider>
    <Provider store={store}>
      <div>
        <LoadingBar updateTime={100} className="loading-bar" />
        <Router>
          <Routes />
        </Router>
      </div>
    </Provider>
  </CookiesProvider>
  ),
  document.getElementById('root')
);
