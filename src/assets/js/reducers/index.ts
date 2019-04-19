import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import { combineReducers, Reducer } from 'redux';
import { reducer as form } from 'redux-form';

import { EventsState } from './Admin/types';
import events from './Events';
import adminReducers, { AdminState } from './admin';
import userReducers, { UserState } from './user';

export interface ApplicationState {
  readonly admin: AdminState;
  readonly user: UserState;
  readonly events: EventsState;
}

const reducers: Reducer = combineReducers({
  admin: combineReducers(adminReducers),
  user: combineReducers(userReducers),
  events,
  form,
  loadingBar,
});

export default reducers;
