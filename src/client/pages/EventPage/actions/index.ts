import { EventStatistics } from '@Shared/api/Responses';
import { createStandardAction } from 'typesafe-actions';
import { ApplicationDispatch, ApplicationAction } from '~/actions';
import { AlertType, PageAlert } from '~/pages/AlertPage';

import * as Types from './types';

export interface AddEventAlertPayload {
  eventAlias: string;
  alert: PageAlert;
}

export interface RemoveEventAlertPayload {
  eventAlias: string;
  timestamp: Date;
}

export interface UpdateEventStatisticsPayload {
  eventAlias: string;
  statistics: EventStatistics;
}

export const _addEventAlert = createStandardAction(Types.ADD_EVENT_ALERT)<AddEventAlertPayload>();
export const _removeEventAlert = createStandardAction(Types.REMOVE_EVENT_ALERT)<RemoveEventAlertPayload>();
export const _updateEventStatistics =
  createStandardAction(Types.UPDATE_EVENT_STATISTICS)<UpdateEventStatisticsPayload>();

export const addEventAlert = (eventAlias: string, message: string,
                              type: AlertType = AlertType.Danger, title: string = ''):
ApplicationAction =>
  (dispatch: ApplicationDispatch) => dispatch(
    _addEventAlert({
      eventAlias,
      alert: {
        message,
        type,
        title,
      } as PageAlert,
    }));

export const addEventSuccessAlert = (eventAlias: string, message: string, title: string): ApplicationAction =>
  (dispatch: ApplicationDispatch) => dispatch(
    _addEventAlert({
      eventAlias,
      alert: {
        message,
        type: AlertType.Success,
        title,
      } as PageAlert,
    }));

export const addEventDangerAlert = (eventAlias: string, message: string, title: string): ApplicationAction =>
  (dispatch: ApplicationDispatch) => dispatch(
    _addEventAlert({
      eventAlias,
      alert: {
        message,
        type: AlertType.Danger,
        title,
      } as PageAlert,
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
