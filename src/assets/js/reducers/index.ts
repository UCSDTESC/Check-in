import {reducer as form} from 'redux-form';
import {combineReducers, Reducer} from 'redux';
import {loadingBarReducer as loadingBar} from 'react-redux-loading-bar';

import adminReducers, { AdminState } from './admin';
import userReducers, { UserState } from './user';
import events from './Events';
import { EventsState } from './Admin/types';

export interface ApplicationState {
  admin: AdminState;
  user: UserState;
  events: EventsState;
}

const reducers: Reducer = combineReducers({
  admin: combineReducers(adminReducers),
  user: combineReducers(userReducers),
  events,
  form,
  loadingBar,
});

export default reducers;
