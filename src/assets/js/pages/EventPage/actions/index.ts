import * as Types from './types';
import { createStandardAction } from 'typesafe-actions';
import { EventAlert } from '../reducers/types';
import { EventStatistics } from '~/static/types';

// TODO: Requires debugging

export const addEventAlert = createStandardAction(Types.ADD_EVENT_ALERT)<{
  eventAlias: string;
  alert: EventAlert;
}>();

export const removeEventAlert = createStandardAction(Types.REMOVE_EVENT_ALERT)<{
  eventAlias: string;
  timestamp: Date;
}>();

export const updateEventStatistics = createStandardAction(Types.UPDATE_EVENT_STATISTICS)<{
  eventAlias: string;
  statistics: EventStatistics;
}>();

// export const addEventAlert = (eventAlias, message, severity, title) =>
//   (dispatch: any) => dispatch({
//     type: Types.ADD_EVENT_ALERT,
//     event: eventAlias,
//     message,
//     severity,
//     title
//   });

// export const removeEventAlert = (eventAlias, timestamp) =>
//   (dispatch: any) => dispatch({
//     type: Types.REMOVE_EVENT_ALERT,
//     event: eventAlias,
//     timestamp
//   });

// export const updateEventStatistics = (eventAlias, statistics) =>
//   (dispatch: any) => dispatch({
//     type: Types.UPDATE_EVENT_STATISTICS,
//     event: eventAlias,
//     statistics
//   });

