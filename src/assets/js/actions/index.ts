import Q from 'q';
import {createStandardAction, ActionType} from 'typesafe-actions';

import * as Types from './types';
import * as Api from '~/data/Api';
import * as UserApi from '~/data/User';
import { TESCEvent, FilterOption } from '~/static/types';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ApplicationState } from '~/reducers';
import { Action, AnyAction } from 'redux';

// General

export const enableEditing = createStandardAction(Types.ENABLE_EDITING)<undefined>();
export const disableEditing = createStandardAction(Types.DISABLE_EDITING)<undefined>();
export const toggleEditing = createStandardAction(Types.TOGGLE_EDITING)<undefined>();

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

export type ApplicationDispatch = ThunkDispatch<ApplicationState, void, Action>;
export type ApplicationAction<ReturnType = void> = ThunkAction<ReturnType, ApplicationState, void, AnyAction>;

export const loadAllAdminEvents = (): ApplicationAction<Q.Promise<{}>> =>
  (dispatch: ApplicationDispatch) => {
    const deferred = Q.defer();
    Api.loadAllEvents()
      .then(res => {
        dispatch(replaceAdminEvents(res));
        return deferred.resolve();
      })
      .catch(deferred.reject);
    return deferred.promise;
  };

export const loadAllPublicEvents = (): ApplicationAction<Q.Promise<{}>> =>
  (dispatch: ApplicationDispatch) => {
  const deferred = Q.defer();

  Api.loadAllPublicEvents()
    .then(res => {
      dispatch(replaceEvents(res));
      return deferred.resolve();
    })
    .catch(deferred.reject);

  return deferred.promise;
};

export const loadUserEvents = (): ApplicationAction<Q.Promise<{}>> =>
  (dispatch: ApplicationDispatch) => {
  const deferred = Q.defer();

  UserApi.getUserEvents()
    .then(res => {
      dispatch(replaceUserEvents(res));
      return deferred.resolve();
    })
    .catch(deferred.reject);

  return deferred.promise;
};
