import * as Types from './types';
import { Admin } from '~/static/types';
import { createStandardAction } from 'typesafe-actions';

// Admins
export const addAdmins = createStandardAction(Types.ADD_ADMINS)<Admin[]>();
export const replaceAdmins = createStandardAction(Types.REPLACE_ADMINS)<Admin[]>();
