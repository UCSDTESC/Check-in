import * as Types from '~/actions/types';
import { EventsState } from './types';
import { TESCEvent } from '~/static/types';
import { addAdminEvent, replaceAdminEvents, addAdminEvents } from '~/actions';
import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';

const initialState: EventsState = {};

export default handleActions({
  [Types.ADD_ADMIN_EVENT]: (state: EventsState, action: ActionType<typeof addAdminEvent>) => ({
    ...state,
    [action.payload.alias]: action.payload,
  }),
  [Types.ADD_ADMIN_EVENTS]: (state: EventsState, action: ActionType<typeof addAdminEvents>) =>
    action.payload
      .reduce((result: EventsState, current: TESCEvent) => {
        result[current.alias] = current;
        return result;
      }, state),
  [Types.REPLACE_ADMIN_EVENTS]: (state: EventsState, action: ActionType<typeof replaceAdminEvents>) =>
    action.payload
      .reduce((result: EventsState, current: TESCEvent) => {
        result[current.alias] = current;
        return result;
      }, {}),
}, initialState);
