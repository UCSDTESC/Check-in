import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import * as Actions from '~/actions';
import * as Types from '~/actions/types';
import { TESCEvent } from '~/static/types';

import { EventsState } from './types';

const initialState: EventsState = {};

export default handleActions({
  [Types.ADD_EVENT]: (state, action: ActionType<typeof Actions.addEvent>) => ({
    ...state,
    [action.payload.alias]: action.payload,
  }),
  [Types.ADD_EVENTS]: (state, action: ActionType<typeof Actions.addEvents>) =>
    action.payload
      .reduce((result: EventsState, current: TESCEvent) => {
        result[current.alias] = current;
        return result;
      }, state),
  [Types.REPLACE_EVENTS]: (state, action: ActionType<typeof Actions.replaceEvents>) =>
    action.payload
      .reduce((result: EventsState, current: TESCEvent) => {
        result[current.alias] = current;
        return result;
      }, {}),
}, initialState);
