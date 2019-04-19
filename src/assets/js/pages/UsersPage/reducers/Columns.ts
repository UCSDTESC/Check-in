import { handleActions, ReducerMap } from 'redux-actions';
import { ActionType } from 'typesafe-actions';

import { addAvailableColumns, addColumn, removeColumn } from '../actions';
import * as Types from '../actions/types';

import { ColumnsState } from './types';

const initialState: ColumnsState = {
  loadedAvailable: false,
  available: [
    {
      Header: 'Email',
      accessor: 'account.email',
    },
  ],
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
  ]};

export default handleActions({
  [Types.ADD_AVAILABLE_COLUMNS]: (state, action: ActionType<typeof addAvailableColumns>) => ({
    ...state,
    available: [...state.available, ...action.payload],
    loadedAvailable: true,
  }),
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
} as ReducerMap<ColumnsState, any>, initialState);
