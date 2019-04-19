import { createStandardAction } from 'typesafe-actions';
import { ApplicationAction, ApplicationDispatch } from '~/actions';
import * as Api from '~/data/Api';
import { TESCUser } from '~/static/types';

import * as Types from './types';

export const userCheckin = (user: TESCUser, eventAlias: string): ApplicationAction<Promise<void>> =>
(dispatch: ApplicationDispatch) =>
  Api.checkinUser(user._id, eventAlias)
    .then(() => {
      dispatch({
        type: Types.CHECKIN_USER,
        user,
      });
    })
    .catch(console.error);

export const _userCheckin = createStandardAction(Types.CHECKIN_USER)<TESCUser>();
