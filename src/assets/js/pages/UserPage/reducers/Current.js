import * as ActionTypes from '../actions/types';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.UPDATE_CURRENT_USER:
    return {...action.user};
  default:
    return state;
  }
};
