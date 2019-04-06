import * as Types from '../actions/types';
import { TESCUser } from '~/static/types';
import { handleActions, ReducerMap } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { addUsers, _updateUser } from '../actions';

const initialState: TESCUser[] = [];

export default handleActions({
  [Types.ADD_USERS]: (state, action: ActionType<typeof addUsers>) => ([
    ...action.payload,
  ]),
  [Types.UPDATE_USER]: (state, action: ActionType<typeof _updateUser>) => ([
    ...state.filter((user) => user._id !== action.payload._id),
    action.payload,
  ]),
} as ReducerMap<TESCUser[], any>, initialState);
