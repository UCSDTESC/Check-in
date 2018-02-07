import * as ActionTypes from '../actions/types';

const initialState = [];

const admins = (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.ADD_ADMINS:
    return [
      ...state,
      ...action.admins
    ];
  case ActionTypes.REPLACE_ADMINS:
    return [
      ...action.admins
    ];
  default:
    return state;
  }
};

export default admins;
