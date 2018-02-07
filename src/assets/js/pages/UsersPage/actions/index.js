import * as Api from '~/data/Api';

import * as Types from './types';

// Users
export const addUsers = (users) => (dispatch) =>
dispatch({
  type: Types.ADD_USERS,
  users
});

// Update the user in the database, and then on the client
export const updateUser = (user) => (dispatch) =>
  Api.updateUser(user._id, user)
  .then(() => {
    dispatch({
      type: Types.UPDATE_USER,
      user
    });
  })
  .catch(console.error);

//Columns
export const addColumn = (column) => ({
  type: Types.ADD_COLUMN,
  column
});

export const removeColumn = (columnName) => ({
  type: Types.REMOVE_COLUMN,
  columnName
});
