import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { ColumnsState } from './types';

const initialState:ColumnsState = {
  loadedAvailable: false,
  available: [
    {
      Header: 'Email',
      accessor: 'account.email'
    }
  ],
  active: [
    {
      Header: 'First Name',
      accessor: 'firstName'
    },
    {
      Header: 'Last Name',
      accessor: 'lastName'
    },
    {
      Header: 'Github',
      accessor: 'github'
    },
    {
      Header: 'Email',
      accessor: 'account.email'
    },
    {
      Header: 'Major',
      accessor: 'major'
    }
  ]};

const userColumns: Reducer<ColumnsState> = (state:ColumnsState = initialState, action) => {
  switch (action.type) {
  case (ActionTypes.ADD_AVAILABLE_COLUMNS):
    return {
      ...state,
      available: [...state.available, ...action.columns],
      loadedAvailable: true
    };
  case (ActionTypes.ADD_COLUMN):
    return {
      ...state,
      active: [
        ...state.active,
        action.column
      ]};
  case (ActionTypes.REMOVE_COLUMN):
    return {
      ...state,
      active: Object.values(state.active)
        .filter(key => key.accessor !== action.columnName)
    };
  }
  return state;
};

export default userColumns;
