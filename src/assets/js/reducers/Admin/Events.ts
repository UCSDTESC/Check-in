import {Reducer, AnyAction} from 'redux';
import * as ActionTypes from '~/actions/types';
import { EventsState } from './types';
import { TESCEvent } from '~/static/types';

const initialState: EventsState = {};

const events: Reducer<EventsState> = (state: EventsState = initialState, action: AnyAction) => {
  switch (action.type) {
  case ActionTypes.ADD_ADMIN_EVENT:
    return {
      ...state,
      [action.payload.alias]: action.payload,
    };
  case ActionTypes.ADD_ADMIN_EVENTS:
    return action.payload
      .reduce((result: EventsState, current: TESCEvent) => {
        result[current.alias] = current;
        return result;
      }, state);
  case ActionTypes.REPLACE_ADMIN_EVENTS:
    return action.payload
      .reduce((result: EventsState, current: TESCEvent) => {
        result[current.alias] = current;
        return result;
      }, {});
  default:
    return state;
  }
};

export default events;
