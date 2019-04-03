import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { EventAlertsState } from './types';

const initialState:EventAlertsState = {};

const eventAlerts: Reducer<EventAlertsState> = (state:EventAlertsState = initialState, action) => {
  switch (action.type) {
  case ActionTypes.ADD_EVENT_ALERT: {
    let newState = Object.assign({}, state);

    let newAlert = {
      message: action.message,
      severity: action.severity,
      title: action.title,
      timestamp: Date.now()
    };

    // Get the current alerts
    let currentAlerts = action.event in newState ? [
      ...newState[action.event],
      newAlert
    ] : [
      newAlert
    ];
    newState[action.event] = currentAlerts;
    return newState;
  }
  case ActionTypes.REMOVE_EVENT_ALERT: {
    if (Object.keys(state).indexOf(action.event) === -1) {
      return state;
    }

    let newState = Object.assign({}, state);
    let currentAlerts = newState[action.event];
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
