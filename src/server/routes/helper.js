const csv = require('fast-csv');

const logging = require('../config/logging');

const Errors = require('./errors')(logging);

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
    checkin: request.checkin
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
  return function(req, res, next) {
    const Admin = require('mongoose').model('Admin');
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

/**
 * Creates a middleware that ensures the authenticated user has permissions to
 * access information about an event.
 */
function isOrganiser(req, res, next) {
  const Event = require('mongoose').model('Event');
  Event.findOne({'alias': req.params.eventAlias}, (err, event) => {
    if (err) {
      Errors.respondError(res, err, Errors.DATABASE_ERROR);
      return next('Database Error');
    }

    if (!event) {
      Errors.respondUserError(res, Errors.NO_ALIAS_EXISTS);
      return next('User Error');
    }

    if (getRole(req.user.role) < getRole(roles.ROLE_DEVELOPER) &&
      event.organisers.indexOf(req.user._id) === -1) {
      Errors.respondUserError(res, Errors.NOT_ORGANISER);
      return next('User Error');
    }

    // Put it into the request object
    req.event = event;

    return next();
  });
}

/**
 * Puts all the users into a CSV file for exporting to ZIP.
 * @param {Object[]} users The list of users to put into the CSV.
 * @param {Object} archive The zip file object to place the CSV.
 * @param {Function} finalize Callback to finish zipping the file.
 */
function exportApplicantInfo(users, archive, finalize) {
  var csvStream = csv.format({headers: true});

  var fileName = __dirname + '/' + process.hrtime()[1] + '.csv';
  //Create a new CSV with the timestamp to store the user information
  var writableStream = fs.createWriteStream(fileName);
  csvStream.pipe(writableStream);

  for (var user of Array.from(users)) {
    csvStream.write({
      firstName: user.firstName,
      lastName: user.lastName,
      schoolYear: user.year,
      university: user.university,
      gender: user.gender,
      status: user.status,
      website: user.website,
      github: user.github,
      resumeFile: user.resume.name,
      resumeLink: user.resume.url
    });
  }

  //Wait until the CSV file is written
  writableStream.on('finish', function() {
    //Append file to the zip
    archive.append(fs.createReadStream(fileName), {name: 'applicants.csv'});

    //Finish the process
    finalize();
    return fs.unlink(fileName);
  });

  return csvStream.end();
};

module.exports = {
  roles,
  setUserInfo,
  getRole,
  roleAuth,
  isOrganiser,
  exportApplicantInfo
};
