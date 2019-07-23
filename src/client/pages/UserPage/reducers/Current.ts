import { TESCUser } from '@Shared/ModelTypes';
import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';

import { updateCurrentUser, updateCurrentTeam } from '../actions';
import * as Types from '../actions/types';

const initialState: TESCUser = null;

export default handleActions<any>({
  [Types.UPDATE_CURRENT_USER]: (state, action: ActionType<typeof updateCurrentUser>) => ({
    ...action.payload,
  }),
  [Types.UPDATE_CURRENT_TEAM]: (state, action: ActionType<typeof updateCurrentTeam>) => ({
    ...state,
    team: action.payload,
  }),
}, initialState);
