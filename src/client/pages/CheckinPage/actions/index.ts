import { TESCUser } from '@Shared/ModelTypes';
import { createStandardAction } from 'typesafe-actions';
import { ApplicationAction, ApplicationDispatch } from '~/actions';
import * as Api from '~/data/AdminApi';

import * as Types from './types';

/**
 * Thunk to make API request to check in the given user.
 * @param user The user to be checked in
 * @param eventId The event to be checked into. 
 */
export const userCheckin = (user: TESCUser, eventId: string): ApplicationAction<Promise<void>> =>
  (dispatch: ApplicationDispatch) =>
    Api.checkinUser(user._id, eventId)
      .then(() => {
        dispatch(_userCheckin(user));
      })
      .catch(console.error);

/**
 * Redux action to to be dispatched when a user in checked in.
 */
export const _userCheckin = createStandardAction(Types.CHECKIN_USER)<TESCUser>();
