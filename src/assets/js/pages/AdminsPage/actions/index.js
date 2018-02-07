import * as Types from './types';

// Admins
export const addAdmins = (admins) => ({
  type: Types.ADD_ADMINS,
  admins
});

export const replaceAdmins = (admins) => ({
  type: Types.REPLACE_ADMINS,
  admins
});
