import * as Types from './types';

import * as Api from '~/data/Api';
import { TESCUser } from '~/static/types';

export const userCheckin = (user: TESCUser, eventAlias: string) => (dispatch: any) =>
  Api.checkinUser(user._id, eventAlias)
    .then(() => {
      dispatch({
        type: Types.CHECKIN_USER,
        user,
      });
    })
    .catch(console.error);
