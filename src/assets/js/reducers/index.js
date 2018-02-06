import {reducer as form} from 'redux-form';
import {combineReducers} from 'redux';
import {loadingBarReducer as loadingBar} from 'react-redux-loading-bar';

export default combineReducers({
  form,
  loadingBar
});
