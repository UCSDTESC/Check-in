import * as ActionTypes from '../actions/types';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.UPDATE_EVENT_STATISTICS: {
    return {...state, [action.event]: action.statistics};
  }
  default:
    return state;
  }
};
