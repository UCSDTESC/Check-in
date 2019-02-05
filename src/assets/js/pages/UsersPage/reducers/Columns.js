import * as ActionTypes from '../actions/types';
import ColumnHeaders from '~/static/ColumnHeaders';

const initialState = [
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
];

const userColumns = (state = initialState, action) => {
  switch (action.type) {
  case (ActionTypes.ADD_COLUMN):
    return [
      ...state,
      {
        Header: ColumnHeaders[action.column] || action.column ,
        accessor: action.column
      }
    ];
  case (ActionTypes.REMOVE_COLUMN):
    return Object.values(state)
      .filter(key => key.accessor !== action.columnName);
  }
  return state;
};

export default userColumns;
