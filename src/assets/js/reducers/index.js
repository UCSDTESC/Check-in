import {reducer as form} from 'redux-form';
import {combineReducers} from 'redux';
import {loadingBarReducer as loadingBar} from 'react-redux-loading-bar';

import adminReducers from './admin';
import userReducers from './user';
import events from './Events';

export default combineReducers({
  admin: combineReducers(adminReducers),
  user: combineReducers(userReducers),
  events,
  form,
  loadingBar
});
