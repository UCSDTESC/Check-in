import { handleActions, ReducerMap } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { PageAlert } from '~/pages/AlertPage';

import { _addEventAlert, _removeEventAlert } from '../actions';
import * as Types from '../actions/types';

import { EventAlertsState } from './types';

const initialState: EventAlertsState = {};

export default handleActions({
  [Types.ADD_EVENT_ALERT]: (state, action: ActionType<typeof _addEventAlert>) => {
    const newState = Object.assign({}, state);
    const payload = action.payload;

    const newAlert: PageAlert = {
      ...payload.alert,
      timestamp: new Date(),
    };

    // Get the current alerts
    const currentAlerts = payload.eventAlias in newState ? [
      ...newState[payload.eventAlias],
      newAlert,
    ] : [
      newAlert,
    ];
    newState[payload.eventAlias] = currentAlerts;
    return newState;
  },
  [Types.REMOVE_EVENT_ALERT]: (state, action: ActionType<typeof _removeEventAlert>) => {
    const payload = action.payload;
    if (Object.keys(state).indexOf(payload.eventAlias) === -1) {
      return state;
    }

    let currentAlerts: PageAlert[] = state[payload.eventAlias];
    // Filter out all messages with the given timestamp.
    currentAlerts = currentAlerts
      .filter((alert) => alert.timestamp !== payload.timestamp);
    const newState: EventAlertsState = {
      ...state,
      [payload.eventAlias]: currentAlerts,
    };
    return newState;
  },
} as ReducerMap<EventAlertsState, any>, initialState);
