import * as Types from './types';
import { createStandardAction } from 'typesafe-actions';
import { EventAlert } from '../reducers/types';
import { EventStatistics } from '~/static/types';
import { AlertType } from '~/pages/AlertPage';
import { ApplicationDispatch, ApplicationAction } from '~/actions';

export interface AddEventAlertPayload {
  eventAlias: string;
  alert: EventAlert;
};

export interface RemoveEventAlertPayload {
  eventAlias: string;
  timestamp: Date;
}

export interface UpdateEventStatisticsPayload {
  eventAlias: string;
  statistics: EventStatistics;
}

const _addEventAlert = createStandardAction(Types.ADD_EVENT_ALERT)<AddEventAlertPayload>();

const _removeEventAlert = createStandardAction(Types.REMOVE_EVENT_ALERT)<RemoveEventAlertPayload>();

const _updateEventStatistics = createStandardAction(Types.UPDATE_EVENT_STATISTICS)<UpdateEventStatisticsPayload>();

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
