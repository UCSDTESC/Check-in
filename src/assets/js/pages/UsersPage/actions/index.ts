import * as Api from '~/data/Api';

import * as Types from './types';
import { createStandardAction } from 'typesafe-actions';
import { TESCUser, Column } from '~/static/types';
import { ApplicationAction, ApplicationDispatch } from '~/actions';

// Users
export const addUsers = createStandardAction(Types.ADD_USERS)<TESCUser[]>();

// Update the user in the database, and then on the client
export const updateUser = (user: TESCUser): ApplicationAction<Q.Promise<void>> =>
(dispatch: ApplicationDispatch) =>
    Api.updateUser(user._id, user.event.alias, user)
      .then(() => {
        dispatch({
          type: Types.UPDATE_USER,
          user,
        });
      })
      .catch(console.error);

// Columns
export const addColumn = createStandardAction(Types.ADD_COLUMN)<Column>();

export const removeColumn = createStandardAction(Types.REMOVE_COLUMN)<Column>();

export const addAvailableColumns = createStandardAction(Types.ADD_AVAILABLE_COLUMNS)<Column[]>();
