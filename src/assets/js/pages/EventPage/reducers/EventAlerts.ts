import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { EventAlertsState, EventAlert } from './types';
import { TESCEvent } from '~/static/types';
import { AddEventAlertPayload, RemoveEventAlertPayload } from '../actions';

const initialState: EventAlertsState = {};

const eventAlerts: Reducer<EventAlertsState> = (state: EventAlertsState = initialState, action) => {
  switch (action.type) {
  case ActionTypes.ADD_EVENT_ALERT: {
    const newState: EventAlertsState = Object.assign({}, state);
    const payload: AddEventAlertPayload = action.payload;

    const newAlert: EventAlert = {
      ...payload.alert,
      timestamp: new Date(),
    };

    // Get the current alerts
    const currentAlerts = action.event in newState ? [
      ...newState[action.event],
      newAlert,
    ] : [
      newAlert,
    ];
    newState[action.event] = currentAlerts;
    return newState;
  }
  case ActionTypes.REMOVE_EVENT_ALERT: {
    if (Object.keys(state).indexOf(action.event) === -1) {
      return state;
    }

    const newState: EventAlertsState = Object.assign({}, state);
    const payload: RemoveEventAlertPayload = action.payload;

    let currentAlerts: EventAlert[] = newState[payload.eventAlias];
    // Filter out all messages with the given timestamp.
    currentAlerts = currentAlerts
      .filter((alert) => alert.timestamp !== action.timestamp);
    newState[action.event] = currentAlerts;
    return newState;
  }
  default:
    return state;
  }
};

export default eventAlerts;
