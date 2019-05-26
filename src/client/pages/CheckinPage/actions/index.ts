import { TESCUser } from '@Shared/ModelTypes';
import { createStandardAction } from 'typesafe-actions';
import { ApplicationAction, ApplicationDispatch } from '~/actions';
import * as Api from '~/data/AdminApi';

import * as Types from './types';

export const userCheckin = (user: TESCUser, eventId: string): ApplicationAction<Promise<void>> =>
  (dispatch: ApplicationDispatch) =>
    Api.checkinUser(user._id, eventId)
      .then(() => {
        dispatch(_userCheckin(user));
      })
      .catch(console.error);

export const _userCheckin = createStandardAction(Types.CHECKIN_USER)<TESCUser>();
