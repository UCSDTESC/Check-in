import { TESCUser } from '@Shared/ModelTypes';
import { Reducer } from 'redux';
import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';

import { _userCheckin } from '../actions';
import * as Types from '../actions/types';

const initialState: TESCUser[] = [];

/**
 * Redux dispatch listener for when a user is checked in to reflect the change in 
 * Redux state.
 */
export default handleActions({
  [Types.CHECKIN_USER]: (state, action: ActionType<typeof _userCheckin>) => ([
    ...state.filter(x => x._id !== action.payload._id), {
    ...action.payload,
    checkedIn: true,
  }]),
}, initialState);
