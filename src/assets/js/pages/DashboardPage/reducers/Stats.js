import * as ActionTypes from '../actions/types';

const initialState = {
  users: {
    total: 0,
    confirmed: 0
  },
  university: {
    total: 0
  }
};

const stats = (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.CHANGE_USER_STATS:
    return {...state, users: action.newStats};
  case ActionTypes.CHANGE_UNIVERSITY_STATS:
    return {...state, university: action.newStats};
  default:
    return state;
  }
};

export default stats;
