import * as Types from './types';
import { createStandardAction } from 'typesafe-actions';
import { EventAlert } from '../reducers/types';
import { EventStatistics } from '~/static/types';
import { AlertType } from '~/pages/AlertPage';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ApplicationState } from '~/reducers';
import { AnyAction } from 'redux';
import { ApplicationDispatch, ApplicationAction } from '~/actions';

const _addEventAlert = createStandardAction(Types.ADD_EVENT_ALERT)<{
  eventAlias: string;
  alert: EventAlert;
}>();

const _removeEventAlert = createStandardAction(Types.REMOVE_EVENT_ALERT)<{
  eventAlias: string;
  timestamp: Date;
}>();

const _updateEventStatistics = createStandardAction(Types.UPDATE_EVENT_STATISTICS)<{
  eventAlias: string;
  statistics: EventStatistics;
}>();

export const addEventAlert = (eventAlias: string, message: string, severity: AlertType, title: string):
ApplicationAction =>
  (dispatch: ApplicationDispatch) => dispatch(
    _addEventAlert({
      eventAlias,
      alert: {
        message,
        severity,
        title,
      } as EventAlert,
    }));

export const addEventSuccessAlert = (eventAlias: string, message: string, title: string): ApplicationAction =>
  (dispatch: ApplicationDispatch) => dispatch(
    _addEventAlert({
      eventAlias,
      alert: {
        message,
        severity: AlertType.Success,
        title,
      } as EventAlert,
    }));

export const addEventDangerAlert = (eventAlias: string, message: string, title: string): ApplicationAction =>
  (dispatch: ApplicationDispatch) => dispatch(
    _addEventAlert({
      eventAlias,
      alert: {
        message,
        severity: AlertType.Danger,
        title,
      } as EventAlert,
    }));

export const removeEventAlert = (eventAlias: string, timestamp: Date): ApplicationAction =>
  (dispatch: ApplicationDispatch) => dispatch(
    _removeEventAlert({
      eventAlias,
      timestamp,
    })
  );

export const updateEventStatistics = (eventAlias: string, statistics: EventStatistics):
  ApplicationAction =>
    (dispatch: ApplicationDispatch) => dispatch(
      _updateEventStatistics({
        eventAlias,
        statistics,
      })
    );

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
