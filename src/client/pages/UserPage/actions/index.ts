import { TESCUser } from '@Shared/ModelTypes';
import { createStandardAction } from 'typesafe-actions';
import { ApplicationAction, ApplicationDispatch } from '~/actions';
import * as Api from '~/data/UserApi';

import * as Types from './types';

// User
export const updateCurrentUser = createStandardAction(Types.UPDATE_CURRENT_USER)<TESCUser>();

// Get the current user information
export const getCurrentUser = (eventAlias: string): ApplicationAction<Promise<{}>> =>
  (dispatch: ApplicationDispatch) =>
    new Promise((resolve, reject) => {
      Api.getCurrentUser(eventAlias)
        .then((user) => {
          dispatch(updateCurrentUser(user[0]));
          resolve();
        })
        .catch(reject);
    });
