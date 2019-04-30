import { TESCUser, Column } from '@Shared/Types';
import { createStandardAction } from 'typesafe-actions';
import { ApplicationAction, ApplicationDispatch } from '~/actions';
import * as Api from '~/data/Api';

import * as Types from './types';

// Users
export const addUsers = createStandardAction(Types.ADD_USERS)<TESCUser[]>();
export const _updateUser = createStandardAction(Types.UPDATE_USER)<TESCUser>();

// Update the user in the database, and then on the client
export const updateUser = (user: TESCUser): ApplicationAction<Promise<void>> =>
(dispatch: ApplicationDispatch) =>
    Api.updateUser(user.event.alias, user)
      .then(() => {
        dispatch(_updateUser(user));
      })
      .catch(console.error);

// Columns
export const addColumn = createStandardAction(Types.ADD_COLUMN)<Column>();
export const removeColumn = createStandardAction(Types.REMOVE_COLUMN)<Column>();
export const addAvailableColumns = createStandardAction(Types.ADD_AVAILABLE_COLUMNS)<Column[]>();
