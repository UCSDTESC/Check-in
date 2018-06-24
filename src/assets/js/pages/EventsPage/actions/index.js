import * as Api from '~/data/User';

import * as Types from './types';

import Q from 'q';

// User
export const loadUserEvents = (events) => ({
  type: Types.LOAD_USER_EVENTS,
  events
});

export const loadAllUserEvents = () => (dispatch) => {
  var deferred = Q.defer();
  Api.loadAllUserEvents()
    .then((res) => {
      dispatch(loadUserEvents(res.events));
      deferred.resolve();
    })
    .catch(deferred.reject);
  return deferred.promise;
};