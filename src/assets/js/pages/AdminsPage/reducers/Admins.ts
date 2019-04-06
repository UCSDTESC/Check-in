import * as Types from '../actions/types';
import { Admin } from '~/static/types';
import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { addAdmins, replaceAdmins } from '../actions';

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
