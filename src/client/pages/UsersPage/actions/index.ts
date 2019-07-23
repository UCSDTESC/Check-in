import { TESCUser } from '@Shared/ModelTypes';
import { createStandardAction } from 'typesafe-actions';
import { ApplicationAction, ApplicationDispatch } from '~/actions';
import * as Api from '~/data/AdminApi';

import { AutofillColumn } from '..';

import * as Types from './types';

// Users
export const addUsers = createStandardAction(Types.ADD_USERS)<TESCUser[]>();
export const _updateUser = createStandardAction(Types.UPDATE_USER)<TESCUser>();

// Update the user in the database, and then on the client
export const updateUser = (user: TESCUser): ApplicationAction<Promise<void>> =>
  (dispatch: ApplicationDispatch) =>
    Api.updateUser(user)
      .then(() => {
        dispatch(_updateUser(user));
      })
      .catch(console.error);

// Columns
export const addColumn = createStandardAction(Types.ADD_COLUMN)<AutofillColumn>();
export const removeColumn = createStandardAction(Types.REMOVE_COLUMN)<AutofillColumn>();
