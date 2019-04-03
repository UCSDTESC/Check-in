import {applyMiddleware, compose, createStore} from 'redux';
import {CookiesProvider} from 'react-cookie';
import {Provider} from 'react-redux';
import * as React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import reduxThunk from 'redux-thunk';
import {render} from 'react-dom';
import LoadingBar from 'react-redux-loading-bar';
import * as ReactGA from 'react-ga';

import Routes from './routes';
import reducer from './reducers';

ReactGA.initialize('UA-123201625-1');

// Required for Redux Devtools Chrome extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
  compose;

// Create Redux store with middlewares
const store = createStore(reducer,
  composeEnhancers(
    applyMiddleware(reduxThunk)
  ));

render(
  <CookiesProvider>
    <Provider store={store}>
      <div>
        <LoadingBar updateTime={100} className="loading-bar" />
        <Router>
          <Routes />
        </Router>
      </div>
    </Provider>
  </CookiesProvider>,
  document.getElementById('root')
);
