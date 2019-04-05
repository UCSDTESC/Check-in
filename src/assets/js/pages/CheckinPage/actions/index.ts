import * as Types from './types';

import * as Api from '~/data/Api';
import { TESCUser } from '~/static/types';
import { ApplicationAction, ApplicationDispatch } from '~/actions';

export const userCheckin = (user: TESCUser, eventAlias: string): ApplicationAction<Q.Promise<void>> =>
(dispatch: ApplicationDispatch) =>
  Api.checkinUser(user._id, eventAlias)
    .then(() => {
      dispatch({
        type: Types.CHECKIN_USER,
        user,
      });
    })
    .catch(console.error);
