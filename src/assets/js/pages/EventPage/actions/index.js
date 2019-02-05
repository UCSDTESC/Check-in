import * as Types from './types';

export const addEventAlert = (eventAlias, message, severity, title) =>
  (dispatch) => dispatch({
    type: Types.ADD_EVENT_ALERT,
    event: eventAlias,
    message,
    severity,
    title
  });

export const removeEventAlert = (eventAlias, timestamp) =>
  (dispatch) => dispatch({
    type: Types.REMOVE_EVENT_ALERT,
    event: eventAlias,
    timestamp
  });

export const updateEventStatistics = (eventAlias, statistics) =>
  (dispatch) => dispatch({
    type: Types.UPDATE_EVENT_STATISTICS,
    event: eventAlias,
    statistics
  });

