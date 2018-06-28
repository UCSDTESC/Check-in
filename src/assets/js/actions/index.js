import Q from 'q';

import * as Types from './types';

import * as Api from '~/data/Api';


// General

export const enableEditing = () => ({
  type: Types.ENABLE_EDITING
});

export const disableEditing = () => ({
  type: Types.DISABLE_EDITING
});

export const toggleEditing = () => ({
  type: Types.TOGGLE_EDITING
});

// Filters

export const addFilter = (name, displayName) => ({
  type: Types.ADD_FILTER,
  name,
  displayName
});

export const removeFilter = (name) => ({
  type: Types.REMOVE_FILTER,
  name
});

export const enableFilter = (name) => ({
  type: Types.ENABLE_FILTER,
  name
});

export const disableFilter = (name) => ({
  type: Types.DISABLE_FILTER,
  name
});

export const toggleFilter = (name) => ({
  type: Types.TOGGLE_FILTER,
  name
});

export const addFilterOption = (name, option) => ({
  type: Types.ADD_FILTER_OPTION,
  name,
  option
});

export const removeFilterOption = (name, option) => ({
  type: Types.REMOVE_FILTER_OPTION,
  name,
  option
});

export const enableFilterOption = (name, option) => ({
  type: Types.ENABLE_FILTER_OPTION,
  name,
  option
});

export const disableFilterOption = (name, option) => ({
  type: Types.DISABLE_FILTER_OPTION,
  name,
  option
});

export const toggleFilterOption = (name, option) => ({
  type: Types.TOGGLE_FILTER_OPTION,
  name,
  option
});

export const selectAllOptions = (name) => ({
  type: Types.SELECT_ALL_FILTER_OPTIONS,
  name
});

export const selectNoneOptions = (name) => ({
  type: Types.SELECT_NONE_FILTER_OPTIONS,
  name
});

// Events
export const addEvent = (event) => ({
  type: Types.ADD_EVENT,
  event
});

export const addEvents = (events) => ({
  type: Types.ADD_EVENTS,
  events
});

export const replaceEvents = (events) => ({
  type: Types.REPLACE_EVENTS,
  events
});

export const replaceDropEvents = (events) => ({
  type: Types.REPLACE_DROP_EVENTS,
  events
});

// Admin Events
export const addAdminEvent = (event) => ({
  type: Types.ADD_ADMIN_EVENT,
  event
});

export const addAdminEvents = (events) => ({
  type: Types.ADD_ADMIN_EVENTS,
  events
});

export const replaceAdminEvents = (events) => ({
  type: Types.REPLACE_ADMIN_EVENTS,
  events
});

export const loadAllAdminEvents = () => (dispatch) => {
  var deferred = Q.defer();

  Api.loadAllEvents()
    .then(res => {
      dispatch(replaceAdminEvents(res));
      return deferred.resolve();
    })
    .catch(deferred.reject);

  return deferred.promise;
};

export const loadAllPublicEvents = () => (dispatch) => {
  var deferred = Q.defer();

  Api.loadAllPublicEvents()
    .then(res => {
      dispatch(replaceEvents(res));
      return deferred.resolve();
    })
    .catch(deferred.reject);

  return deferred.promise;
};

export const loadAllPublicDropEvents = () => (dispatch) => {
  var deferred = Q.defer();

  Api.loadAllPublicDropEvents()
    .then(res => {
      dispatch(replaceDropEvents(res));
      return deferred.resolve();
    })
    .catch(deferred.reject);

  return deferred.promise;
};

export const updateResumeEvent = (event) => {

  return {
    type: Types.LOAD_RESUME_EVENT,
    event
  };
};

export const loadResumeEvent = (eventAlias) => (dispatch) => {
  var deferred = Q.defer();
  Api.getResumeEvent(eventAlias)
    .then((res) => {
      dispatch(updateResumeEvent(res.event));
      return deferred.resolve();
    })
    .catch(deferred.reject);
  return deferred.promise;
};

