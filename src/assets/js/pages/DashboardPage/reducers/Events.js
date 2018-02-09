import * as ActionTypes from '../actions/types';

const initialState = [];

const events = (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.ADD_EVENTS:
    return [
      ...state,
      ...action.events
    ];
  case ActionTypes.REPLACE_EVENTS:
    return [
      ...action.events
    ];
  default:
    return state;
  }
};

export default events;
