import * as ActionTypes from '../actions/types';

const initialState = [];

const checkin = (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.CHECKIN_USER:
    return {...state.user};
  default:
    return state;
  }
};

export default checkin;
