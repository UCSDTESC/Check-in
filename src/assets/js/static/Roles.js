// Administrator Roles

const Roles = {
  ROLE_DEVELOPER: 'Developer',
  ROLE_ADMIN: 'Admin',
  ROLE_SPONSOR: 'Sponsor',
  ROLE_MEMBER: 'Member'
};

const RolesColors = {
  [Roles.ROLE_DEVELOPER]: 'success',
  [Roles.ROLE_ADMIN]: 'primary',
  [Roles.ROLE_SPONSOR]: 'danger',
  [Roles.ROLE_MEMBER]: 'secondary'
};

/**
 * Gets the integer associated with the given role.
 * @param  {Roles} checkRole The role to check - must be an enum value of
 * {@link Roles}.
 * @returns {Integer} The integer for the given role.
 */
function getRole(checkRole) {
  var role;

  switch (checkRole) {
  case Roles.ROLE_DEVELOPER: role = 4; break;
  case Roles.ROLE_ADMIN: role = 3; break;
  case Roles.ROLE_SPONSOR: role = 2; break;
  case Roles.ROLE_MEMBER: role = 1; break;
  default: role = 1;
  }

  return role;
};

module.exports = {
  Roles,
  RolesColors,
  getRole
};
