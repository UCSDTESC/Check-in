import * as Types from '../actions/types';
import { TESCUser } from '~/static/types';
import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { updateCurrentUser } from '../actions';

const initialState: TESCUser = null;

export default handleActions({
  [Types.UPDATE_CURRENT_USER]: (state, action: ActionType<typeof updateCurrentUser>) => ({
    ...action.payload,
  }),
}, initialState);
