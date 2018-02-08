import {reducer as form} from 'redux-form';
import {combineReducers} from 'redux';
import {loadingBarReducer as loadingBar} from 'react-redux-loading-bar';

import adminReducers from './admin';

export default combineReducers({
  admin: combineReducers(adminReducers),
  form,
  loadingBar
});
