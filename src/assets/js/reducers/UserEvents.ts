import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { replaceUserEvents, addUserEvent } from '~/actions';
import * as Types from '~/actions/types';

import { UserEventsState } from './types';

const initialState: UserEventsState = {};

export default handleActions({
  [Types.REPLACE_USER_EVENTS]: (state, action: ActionType<typeof replaceUserEvents>) =>
    action.payload
      .reduce((result: UserEventsState, current) => {
        result[current.alias] = current;
        return result;
      }, {}),
  [Types.ADD_USER_EVENT]: (state, action: ActionType<typeof addUserEvent>) => ({
      ...state,
      [action.payload.alias]: action.payload,
    } as UserEventsState),
  [Types.DELETE_USER_EVENTS]: () => ({
  }),
}, initialState);
