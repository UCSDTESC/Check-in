import * as Api from '~/data/User';

import * as Types from './types';

import Q from 'q';

// User
export const updateCurrentUser = (user) => ({
  type: Types.UPDATE_CURRENT_USER,
  user
});

// Get the current user information
export const getCurrentUser = (eventAlias) => (dispatch) => {
  var deferred = Q.defer();
  Api.getCurrentUser(eventAlias)
    .then((user) => {
      dispatch(updateCurrentUser(user));
      deferred.resolve();
    })
    .catch(deferred.reject);
  return deferred.promise;
};

