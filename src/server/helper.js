const roles = {
  ROLE_DEVELOPER: 'Developer',
  ROLE_ADMIN: 'Admin',
  ROLE_SPONSOR: 'Sponsor',
  ROLE_MEMBER: 'Member'
};

// Authentication Helper
/**
 * Reduces a user object down into public information.
 * @param {Object} request A full user's information.
 * @returns {Object} A formatted user for public consumption.
 */
function setUserInfo(request) {
  return {
    _id: request._id,
    username: request.username,
    role: request.role,
  };
};

/**
 * Gets the integer associated with the given role.
 * @param  {roles} checkRole The role to check - must be an enum value of
 * {@link roles}.
 * @returns {Integer} The integer for the given role.
 */
function getRole(checkRole) {
  var role;

  switch (checkRole) {
  case roles.ROLE_DEVELOPER: role = 4; break;
  case roles.ROLE_ADMIN: role = 3; break;
  case roles.ROLE_SPONSOR: role = 2; break;
  case roles.ROLE_MEMBER: role = 1; break;
  default: role = 1;
  }

  return role;
};

/**
 * Creates a middleware that ensures the authenticated user has permissions of
 * at least a given role.
 * @param {role} role The role to check against.
 * @returns {Function} The middleware function to apply to a route.
 */
function roleAuth(role) {
  const Admin = require('./models/admin');

  return function(req, res, next) {
    const user = req.user;

    Admin.findById(user._id, function(err, foundAdmin) {
      if (err) {
        res.status(422).json({error: 'No user was found.'});
        return next(err);
      }

      // If admin is found, check role.
      if (getRole(foundAdmin.role) >= getRole(role)) {
        req.user.role = foundAdmin.role;
        return next();
      }

      res.status(401).json({
        error: 'You are not authorized to view this content.'
      });
      return next('Unauthorized');
    });
  };
};

module.exports = {
  roles,
  setUserInfo,
  getRole,
  roleAuth
};
