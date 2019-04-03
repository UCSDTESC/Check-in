import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { TESCUser } from '~/static/types';

const initialState: TESCUser[] = [];

const user = (state: TESCUser[], action) => {
  switch (action.type) {
  case ActionTypes.ADD_USERS:
    return action.users;
  case ActionTypes.UPDATE_USER:
    return state.filter((user) => user._id !== action.user._id);
  default:
    return state;
  }
};

const users: Reducer<TESCUser[]> = (state: TESCUser[] = initialState, action) => {
  switch (action.type) {
  case ActionTypes.ADD_USERS:
    return [
      ...user(undefined, action),
    ];
  case ActionTypes.UPDATE_USER:
    const oldUsers = user(state, action);
    return [
      ...oldUsers,
      action.user,
    ];
  default:
    return state;
  }
};

export default users;
