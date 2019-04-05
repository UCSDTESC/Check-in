import * as Api from '~/data/User';

import * as Types from './types';

import Q from 'q';
import { TESCUser } from '~/static/types';
import { createStandardAction } from 'typesafe-actions';
import { ApplicationAction, ApplicationDispatch } from '~/actions';

// User
export const updateCurrentUser = createStandardAction(Types.UPDATE_CURRENT_USER)<TESCUser>();

// Get the current user information
export const getCurrentUser = (eventAlias: string): ApplicationAction<Q.Promise<{}>> =>
(dispatch: ApplicationDispatch) => {
  const deferred = Q.defer();
  Api.getCurrentUser(eventAlias)
    .then((user) => {
      dispatch(updateCurrentUser(user));
      deferred.resolve();
    })
    .catch(deferred.reject);
  return deferred.promise;
};
