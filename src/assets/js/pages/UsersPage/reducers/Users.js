import * as ActionTypes from '../actions/types';

const initialState = [];

const user = (state, action) => {
  switch (action.type) {
  case ActionTypes.ADD_USERS:
    return action.users;
  case ActionTypes.UPDATE_USER:
    return state.filter((user) => user._id !== action.user._id);
  default:
    return state;
  }
};

const users = (state = initialState, action) => {
  switch (action.type) {
  case ActionTypes.ADD_USERS:
    return [
      ...user(undefined, action)
    ];
  case ActionTypes.UPDATE_USER:
    let oldUsers = user(state, action);
    return [
      ...oldUsers,
      action.user
    ];
  default:
    return state;
  }
};

export default users;
