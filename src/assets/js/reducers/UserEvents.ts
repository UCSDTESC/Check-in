import {Reducer} from 'redux';
import * as ActionTypes from '~/actions/types';
import { UserEventsState } from './types';

const initialState: UserEventsState = {};

const events: Reducer<UserEventsState> = (state: UserEventsState = initialState, action) => {
  switch (action.type) {
  case ActionTypes.REPLACE_USER_EVENTS:
    return action.events
      .reduce((result, current) => {
        result[current.alias] = current;
        return result;
      }, {});
  case ActionTypes.ADD_USER_EVENT:
    return {
      ...state,
      [action.event.alias]: action.event,
    };
  case ActionTypes.DELETE_USER_EVENTS:
    return {};
  default:
    return state;
  }
};

export default events;
