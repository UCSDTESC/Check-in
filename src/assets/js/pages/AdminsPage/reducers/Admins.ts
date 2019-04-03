import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { Admin } from '~/static/types';

const initialState:Admin[] = [];

const admins: Reducer<Admin[]> = (state:Admin[] = initialState, action) => {
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
