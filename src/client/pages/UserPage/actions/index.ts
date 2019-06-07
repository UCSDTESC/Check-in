import { TESCUser, TESCTeam } from '@Shared/ModelTypes';
import { createStandardAction } from 'typesafe-actions';
import { ApplicationAction, ApplicationDispatch } from '~/actions';
import * as Api from '~/data/UserApi';

import * as Types from './types';

// User
export const updateCurrentUser = createStandardAction(Types.UPDATE_CURRENT_USER)<TESCUser>();
export const updateCurrentTeam = createStandardAction(Types.UPDATE_CURRENT_TEAM)<TESCTeam>();

// Get the current user information
export const getCurrentUser = (eventAlias: string): ApplicationAction<Promise<TESCUser>> =>
  (dispatch: ApplicationDispatch) =>
    new Promise((resolve, reject) => {
      Api.getCurrentUser(eventAlias)
        .then((user) => {
          dispatch(updateCurrentUser(user[0]));
          resolve(user[0]);
        })
        .catch(reject);
    });

// Get the current user information
export const getCurrentTeam = (userId: string): ApplicationAction<Promise<TESCTeam>> =>
  (dispatch: ApplicationDispatch) =>
    new Promise((resolve, reject) => {
      Api.getTeam(userId)
        .then((team) => {
          dispatch(updateCurrentTeam(team));
          resolve(team);
        })
        .catch(reject);
    });
