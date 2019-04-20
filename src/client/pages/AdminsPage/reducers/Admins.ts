import { Admin } from 'Shared/types';
import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';

import { addAdmins, replaceAdmins } from '../actions';
import * as Types from '../actions/types';

const initialState: Admin[] = [];

export default handleActions({
  [Types.ADD_ADMINS]: (state, action: ActionType<typeof addAdmins>) => ([
    ...state,
    ...action.payload,
  ]),
  [Types.REPLACE_ADMINS]: (state, action: ActionType<typeof replaceAdmins>) => ([
    ...action.payload,
  ]),
}, initialState);
