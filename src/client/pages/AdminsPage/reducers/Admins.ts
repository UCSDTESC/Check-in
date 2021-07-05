import { Admin } from '@Shared/ModelTypes';
import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';

import { addAdmins, replaceAdmins } from '../actions';
import * as Types from '../actions/types';

const initialState: Admin[] = [];

// Tell redux what to do when it sees ADD_ADMINS and REPLACE_ADMINS
export default handleActions({
  [Types.ADD_ADMINS]: (state, action: ActionType<typeof addAdmins>) => ([
    ...state,
    ...action.payload,
  ]),
  [Types.REPLACE_ADMINS]: (state, action: ActionType<typeof replaceAdmins>) => ([
    ...action.payload,
  ]),
}, initialState);
