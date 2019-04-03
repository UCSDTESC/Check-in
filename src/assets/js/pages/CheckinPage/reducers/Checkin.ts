import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { TESCUser } from '~/static/types';

const initialState: TESCUser[] = [];

const checkin: Reducer<TESCUser[]> = (state: TESCUser[] = initialState, action) => {
  switch (action.type) {
  case ActionTypes.CHECKIN_USER:
    return [...state.filter(x => x._id !== action.user._id), {
      ...action.user,
      checkedIn: true
    }];
  default:
    return state;
  }
};

export default checkin;
