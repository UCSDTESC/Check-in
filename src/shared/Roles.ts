import { Admin } from './ModelTypes';

// Administrator Roles

export enum Role {
  ROLE_DEVELOPER = 'Developer',
  ROLE_ADMIN = 'Admin',
  ROLE_SPONSOR = 'Sponsor',
  ROLE_MEMBER = 'Member',
}

export const RolesColors = {
  [Role.ROLE_DEVELOPER]: 'success',
  [Role.ROLE_ADMIN]: 'primary',
  [Role.ROLE_SPONSOR]: 'danger',
  [Role.ROLE_MEMBER]: 'secondary',
};

/**
 * Gets the integer associated with the given role.
 * @param  {Roles} checkRole The role to check - must be an enum value of
 * {@link Roles}.
 * @returns {Integer} The integer for the given role.
 */
export function getRoleRank(checkRole: Role) {
  let role;

  switch (checkRole) {
  case Role.ROLE_DEVELOPER: role = 4; break;
  case Role.ROLE_ADMIN: role = 3; break;
  case Role.ROLE_SPONSOR: role = 2; break;
  case Role.ROLE_MEMBER: role = 1; break;
  default: role = 1;
  }

  return role;
}

/**
 * Determines whether the given admin has the role privileges of at least checkRole.
 * @param admin The admin to check the rank for.
 * @param checkRole The role to check against.
 */
export function hasRankAtLeast(admin: Admin, checkRole: Role) {
  return getRoleRank(admin.role) >= getRoleRank(checkRole);
}

/**
 * Determines whether the given admin has exactly the role.
 * @param admin The admin to check the rank for.
 * @param checkRole The role to check against.
 */
export function hasRankEqual(admin: Admin, checkRole: Role) {
  return getRoleRank(admin.role) === getRoleRank(checkRole);
}
