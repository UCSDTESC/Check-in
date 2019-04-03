import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { EventAlertsState, EventAlert } from './types';
import { TESCEvent } from '~/static/types';

const initialState: EventAlertsState = {};

const eventAlerts: Reducer<EventAlertsState> = (state: EventAlertsState = initialState, action) => {
  switch (action.type) {
  case ActionTypes.ADD_EVENT_ALERT: {
    const newState: EventAlertsState = Object.assign({}, state);

    const newAlert = {
      message: action.message,
      severity: action.severity,
      title: action.title,
      timestamp: Date.now(),
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
    let currentAlerts: EventAlert = newState[action.event];
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
