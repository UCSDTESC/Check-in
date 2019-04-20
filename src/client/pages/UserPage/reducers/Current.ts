import { TESCUser } from 'Shared/types';
import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';

import { updateCurrentUser } from '../actions';
import * as Types from '../actions/types';

const initialState: TESCUser = null;

export default handleActions({
  [Types.UPDATE_CURRENT_USER]: (state, action: ActionType<typeof updateCurrentUser>) => ({
    ...action.payload,
  }),
}, initialState);
