import * as ActionTypes from '../actions/types';

const initialState = [];

const checkin = (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.CHECKIN_USER:
    return [...state.filter(x => x._id !== action.user._id), {...action.user, checkedIn: true}];
  default:
    return state;
  }
};

export default checkin;
