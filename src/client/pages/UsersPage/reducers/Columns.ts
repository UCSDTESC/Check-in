import { handleActions, ReducerMap } from 'redux-actions';
import { ActionType } from 'typesafe-actions';

import { addColumn, removeColumn } from '../actions';
import * as Types from '../actions/types';

import { ColumnsState as UserPageColumnsState } from './types';

const initialState: UserPageColumnsState = {
  active: [
    {
      Header: 'First Name',
      accessor: 'firstName',
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
    },
    {
      Header: 'Github',
      accessor: 'github',
    },
    {
      Header: 'Email',
      accessor: 'account.email',
    },
    {
      Header: 'Major',
      accessor: 'major',
    },
    {
      Header: 'Team Code',
      accessor: 'team.code',
    },
  ],
};

export default handleActions({
  [Types.ADD_COLUMN]: (state, action: ActionType<typeof addColumn>) => ({
    ...state,
    active: [
      ...state.active,
      action.payload,
    ],
  }),
  [Types.REMOVE_COLUMN]: (state, action: ActionType<typeof removeColumn>) => ({
    ...state,
    active: Object.values(state.active)
      .filter(key => key.accessor !== action.payload.accessor),
  }),
} as ReducerMap<UserPageColumnsState, any>, initialState);
