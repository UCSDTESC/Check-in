import { Admin } from '@Shared/ModelTypes';
import { createStandardAction } from 'typesafe-actions';

import * as Types from './types';

// TODO: Not sure what this action does
export const addAdmins = createStandardAction(Types.ADD_ADMINS)<Admin[]>();

// Replace the `admins` state with the payload
export const replaceAdmins = createStandardAction(Types.REPLACE_ADMINS)<Admin[]>();
