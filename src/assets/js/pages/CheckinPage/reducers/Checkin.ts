import {Reducer} from 'redux';
import * as Types from '../actions/types';
import { TESCUser } from '~/static/types';
import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { _userCheckin } from '../actions';

const initialState: TESCUser[] = [];

export default handleActions({
  [Types.CHECKIN_USER]: (state, action: ActionType<typeof _userCheckin>) => ([
    ...state.filter(x => x._id !== action.payload._id), {
    ...action.payload,
    checkedIn: true,
  }]),
}, initialState);
