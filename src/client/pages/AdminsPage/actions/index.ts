import { Admin } from '@Shared/ModelTypes';
import { createStandardAction } from 'typesafe-actions';

import * as Types from './types';

// Admins
export const addAdmins = createStandardAction(Types.ADD_ADMINS)<Admin[]>();
export const replaceAdmins = createStandardAction(Types.REPLACE_ADMINS)<Admin[]>();
