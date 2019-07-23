import { TESCEvent } from '@Shared/ModelTypes';
import { EventsWithStatisticsResponse, ColumnResponse } from '@Shared/api/Responses';
import { Action, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { createStandardAction, ActionType } from 'typesafe-actions';
import User from '~/components/User';
import * as AdminApi from '~/data/AdminApi';
import * as UserApi from '~/data/UserApi';
import { ApplicationState } from '~/reducers';
import { FilterOption, ColumnDefinitions } from '~/static/Types';

import * as Types from './types';

// User Events

export const replaceUserEvents = createStandardAction(Types.REPLACE_USER_EVENTS)<TESCEvent[]>();
export const addUserEvent = createStandardAction(Types.ADD_USER_EVENT)<TESCEvent>();
export const deleteUserEvents = createStandardAction(Types.DELETE_USER_EVENTS)<undefined>();

// Filters

export const addFilter = createStandardAction(Types.ADD_FILTER)<{
  name: string;
  displayName: string;
}>();
export const removeFilter = createStandardAction(Types.REMOVE_FILTER)<string>();
export const enableFilter = createStandardAction(Types.ENABLE_FILTER)<string>();
export const disableFilter = createStandardAction(Types.DISABLE_FILTER)<string>();
export const toggleFilter = createStandardAction(Types.TOGGLE_FILTER)<string>();

export const filterOptionActions = {
  addFilterOption: createStandardAction(Types.ADD_FILTER_OPTION)<FilterOption>(),
  removeFilterOption: createStandardAction(Types.REMOVE_FILTER_OPTION)<FilterOption>(),
  enableFilterOption: createStandardAction(Types.ENABLE_FILTER_OPTION)<FilterOption>(),
  disableFilterOption: createStandardAction(Types.DISABLE_FILTER_OPTION)<FilterOption>(),
  toggleFilterOption: createStandardAction(Types.TOGGLE_FILTER_OPTION)<FilterOption>(),
};
export const selectAllOptions = createStandardAction(Types.SELECT_ALL_FILTER_OPTIONS)<string>();
export const selectNoneOptions = createStandardAction(Types.SELECT_NONE_FILTER_OPTIONS)<string>();

export type FilterActionsTypes = ActionType<typeof enableFilter | typeof disableFilter | typeof toggleFilter>;
export type FilterOptionActionsTypes = ActionType<typeof filterOptionActions>;

// Events
export const addEvent = createStandardAction(Types.ADD_EVENT)<TESCEvent>();
export const addEvents = createStandardAction(Types.ADD_EVENTS)<TESCEvent[]>();
export const replaceEvents = createStandardAction(Types.REPLACE_EVENTS)<TESCEvent[]>();

// Admin Events
export const addAdminEvent = createStandardAction(Types.ADD_ADMIN_EVENT)<TESCEvent>();
export const addAdminEvents = createStandardAction(Types.ADD_ADMIN_EVENTS)<TESCEvent[]>();
export const replaceAdminEvents = createStandardAction(Types.REPLACE_ADMIN_EVENTS)<TESCEvent[]>();

// Available Columns
export const replaceAvailableColumns = createStandardAction(Types.REPLACE_AVAILABLE_COLUMNS)<ColumnDefinitions>();

export type ApplicationDispatch = ThunkDispatch<ApplicationState, void, Action>;
export type ApplicationAction<ReturnType = void> = ThunkAction<ReturnType, ApplicationState, void, AnyAction>;

const mapUserCountIntoEvents = (response: EventsWithStatisticsResponse): TESCEvent[] =>
  response.events.map(event => {
    const userCount = response.userCounts.find(count => count._id === event._id);
    return {
      ...event,
      users: userCount === undefined ? 0 : userCount.count,
    };
  });

export const loadAllAdminEvents = (): ApplicationAction<Promise<{}>> =>
  (dispatch: ApplicationDispatch) =>
    new Promise((resolve, reject) => {
      AdminApi.loadAllEvents()
        .then(res => {
          const mapped = mapUserCountIntoEvents(res);
          dispatch(replaceAdminEvents(mapped));
          return resolve();
        })
        .catch(reject);
    });

export const loadAllPublicEvents = (): ApplicationAction<Promise<{}>> =>
  (dispatch: ApplicationDispatch) =>
    new Promise((resolve, reject) => {
      UserApi.loadAllPublicEvents()
        .then(res => {
          const mapped = mapUserCountIntoEvents(res);
          dispatch(replaceEvents(mapped));
          return resolve();
        })
        .catch(reject);
    });

export const loadAccountEvents = (accountId: string): ApplicationAction<Promise<{}>> =>
  (dispatch: ApplicationDispatch) =>
    new Promise((resolve, reject) => {
      UserApi.getAccountEvents(accountId)
        .then(res => {
          dispatch(replaceUserEvents(res));
          return resolve();
        })
        .catch(reject);
    });

export const loadAvailableColumns = (): ApplicationAction<Promise<ColumnDefinitions>> =>
  (dispatch: ApplicationDispatch) =>
    new Promise((resolve, reject) => {
      AdminApi.loadColumns()
        .then(res => {
          dispatch(replaceAvailableColumns(res));
          return resolve(res);
        })
        .catch(reject);
    });
