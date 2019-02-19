const fs = require('fs');

const csv = require('fast-csv');

const mongoose = require('mongoose');

const logging = require('../config/logging');

const Errors = require('./errors')(logging);

const roles = {
  ROLE_DEVELOPER: 'Developer',
  ROLE_ADMIN: 'Admin',
  ROLE_SPONSOR: 'Sponsor',
  ROLE_MEMBER: 'Member'
};

const ADMIN_JWT_TIMEOUT = 3 * 60 * 60;
const USER_JWT_TIMEOUT = 7 * 24 * 60 * 60;

const PUBLIC_EVENT_FIELDS = 'name alias logo closeTime homepage organisedBy';

// Conditions that must be met for sponsors to see resumes
const getResumeConditions = (req) => ({
  deleted: {$ne: true},
  shareResume: true,
  resume: {$exists: true},
  'resume.size': {$gt: 0},
  sanitized: true,
  event: req.event
});

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
 * Creates a middleware that ensures the authenticated user has permissions to
 * access information about an event.
 */
function isSponsor(req, res, next) {
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

    if (getRole(req.user.role) === getRole(roles.ROLE_ADMIN)) {
      return isOrganiser(req, res, next);
    }

    if (getRole(req.user.role) < getRole(roles.ROLE_DEVELOPER) &&
      event.sponsors.indexOf(req.user._id) === -1) {
      Errors.respondUserError(res, Errors.NOT_SPONSOR);
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
      email: user.account.email,
      university: user.university,
      gender: user.gender,
      status: user.status,
      website: user.website,
      github: user.github,
      resumeFile: user.resume.name,
      resumeLink: user.resume.url,
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

function writeToCSV(masterList) {
  console.log('\x1b[32m', '✓ Writing To teams.csv' ,'\x1b[0m');

  let csvStream = csv.createWriteStream({headers: true}),
    writableStream = fs.createWriteStream("teams.csv");

  csvStream.pipe(writableStream);

  masterList.forEach((o, i) => {
    o.team = [...o.team];
    csvStream.write(o);

    if (i === masterList.length - 1) {
      console.log('\x1b[32m', '✓ Done' ,'\x1b[0m');
      return csvStream.end();
    }
  });

};

function cherryPick(masterList, indexMapper) {
  //if nothing is passed, build the whole csv
  if (!process.argv[2]) {
    console.log("\x1b[35m", `You did not pass a cherry pick JSON file - building all teams` , "\x1b[35m");
    return writeToCSV(masterList);
  }

  let toBePicked = require(process.argv[2]);
  let newMasterList = [];

  toBePicked.forEach((x) => {
    if (!indexMapper[x]) {
      console.log("\x1b[31m", `X There was an email, ${x} in your file that there is no application for -- this should never happen` , "\x1b[31m");
      return;
    }
    newMasterList.push(masterList[indexMapper[x]]);
  })

  return writeToCSV(newMasterList);
};

function bfs(vertices) {

  /*vertices = {
    'David': ['Panda'],
    'Yacoub': ['Panda'],
    'Nick' : ['Yacoub', 'David'],
    'Panda' : [],
  };*/
 
  let visited = new Set(),
    indexMapper = {},
    masterList = [];

    console.log('\x1b[32m', '✓ Building Teams' ,'\x1b[0m');

  //for each node...
  Object.keys(vertices).forEach((v, j) => {


    let q = [v],
      currTeam = new Set(),
      flag = true,
      info = 'Applications Not Found: ';

    while (q.length !== 0) {
      v = q.shift();

      //don't revisit
      if (visited.has(v)) {
        continue;
      }

      visited.add(v);
      currTeam.add(v);

      //if an application for this email exists..
      if (vertices[v]) {
        //loop through children
        vertices[v].forEach(c => {

          if (visited.has(c)) {

            //if we hit a child that exists in masterList
            if (masterList[indexMapper[c]]) {

              //update masterList and reflect the change in indexMapper
              masterList[indexMapper[c]].team = masterList[indexMapper[c]].team.add(v);
              indexMapper[v] = indexMapper[c];

              //set flag to end BFS 
              flag = false;
            }
            return;
          }
          else {

            //unvisit node, enqueue it
            q.push(c);
          }
        });
      }
      else {
        //no application found
        info += v + "     ";
      }

      //break out of the BFS
      if (flag === false) {
        break;
      }
    }

    //these changes are already made in lines 74-76 for when flag = false
    if (flag && currTeam.size > 0) {
      currTeam.forEach(c => indexMapper[c] = masterList.length);
      masterList.push({team: currTeam, info});
    }

    //write to CSV on end of this loop
    if (j === Object.keys(vertices).length - 1) {
      return cherryPick(masterList, indexMapper);
    }
  });
};

function buildVertices(users) {
  console.log('\x1b[32m', '✓ Building Graph Vertices' ,'\x1b[0m');
  let vertices = {};

  users.forEach((user, i) => {
    let currNodeChildren = [];
    if (user.teammates && user.teammates.length > 0) {
      user.teammates.forEach(x => {
        if (x.length > 0) currNodeChildren.push(x.toLowerCase());
      });
    }
    vertices[user.account.email.toLowerCase()] = currNodeChildren;

    if (i === users.length - 1) {
      return bfs(vertices);
    }
  });
};


module.exports = {
  roles,
  setUserInfo,
  getRole,
  roleAuth,
  isOrganiser,
  isSponsor,
  exportApplicantInfo,
  writeToCSV,
  cherryPick,
  bfs,
  buildVertices,
  getResumeConditions,
  PUBLIC_EVENT_FIELDS,
  ADMIN_JWT_TIMEOUT,
  USER_JWT_TIMEOUT
};
