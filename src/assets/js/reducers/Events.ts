import {Reducer} from 'redux';
import * as ActionTypes from '~/actions/types';
import { EventsState } from './types';

const initialState: EventsState = {};

const events: Reducer<EventsState> = (state: EventsState = initialState, action) => {
  switch (action.type) {
  case ActionTypes.ADD_EVENT:
    return {
      ...state,
      [action.event.alias]: action.event,
    };
  case ActionTypes.ADD_EVENTS:
    return action.events
      .reduce((result, current) => {
        result[current.alias] = current;
        return result;
      }, state);
  case ActionTypes.REPLACE_EVENTS:
    return action.events
      .reduce((result, current) => {
        result[current.alias] = current;
        return result;
      }, {});
  default:
    return state;
  }
};

export default events;
