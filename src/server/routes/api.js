const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const json2CSVParser = require('json2csv').Parser;
const S3Archiver = require('s3-archiver');
const moment = require('moment');
const generatePassword = require('password-generator');

const logging = require('../config/logging');

const {roleAuth, roles, getRole, isOrganiser, isSponsor, exportApplicantInfo,
  getResumeConditions, PUBLIC_EVENT_FIELDS} = require('./helper');
const Errors = require('./errors')(logging);

const Admin = mongoose.model('Admin');
const Download = mongoose.model('Download');
const Event = mongoose.model('Event');
const User = mongoose.model('User');

const requireAuth = passport.authenticate('adminJwt', {session: false});

module.exports = function(app) {
  const api = express.Router();

  app.use('/api', api);
  require('./user')(api);
  require('./auth')(api);
  require('./registration')(api);

  var zipper = new S3Archiver({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: 'us-west-1',
    bucket: process.env.S3_BUCKET
  }, {
    folder: 'resumes',
    filePrefix: 'resumes/'
  });

  addEventStatistics = (events) => {
    return new Promise((resolve) => {
      newEvents = [];
      updated = 0;

      if (!events || events.length === 0) {
        resolve([]);
      }

      events.forEach((event) => {
        User.count({event})
          .catch(logging.error)
          .then(count => {
            let newEvent = event.toJSON();
            newEvent.users = count;
            newEvents.push(newEvent);

            updated++;
            if (updated === events.length) {
              resolve(newEvents);
            }
          });
      });
    });
  };

  api.get('/events', (req, res) => {
    return Event.find()
      .select(PUBLIC_EVENT_FIELDS)
      .exec()
      .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
      .then(addEventStatistics)
      .then(events => res.json(events));
  });

  api.get('/admin/events', requireAuth, roleAuth(roles.ROLE_SPONSOR),
    (req, res) => {
      var query;
      if (getRole(req.user.role) === getRole(roles.ROLE_SPONSOR)) {
        query = Event.find({'sponsors': req.user});
      } else if (getRole(req.user.role) >= getRole(roles.ROLE_DEVELOPER)) {
        query = Event.find();
      } else {
        query = Event.find({'organisers': req.user});
      }

      return query
        .populate('organisers')
        .populate('sponsors')
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(addEventStatistics)
        .then(events => res.json(events));
    });

  api.get('/admin/events/:eventAlias',
    (req, res) => {
      return Event.findOne({'alias': req.params.eventAlias})
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(event => {
          if (!event) {
            return Errors.respondUserError(res, Errors.NO_ALIAS_EXISTS);
          }

          return res.json({
            _id: event._id,
            name: event.name,
            logo: event.logo,
            alias: event.alias,
            homepage: event.homepage,
            description: event.description,
            email: event.email,
            closeTime: event.closeTime,
            checkinWaiver: event.checkinWaiver,
            options: event.options
          });
        });
    });

  api.get('/admin/export/:eventAlias', requireAuth, roleAuth(roles.ROLE_ADMIN),
    isOrganiser, (req, res) => {
      return User.find({event: req.event})
        .populate('account')
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then((users) => {
          var filledUsers = [];
          users.forEach((user) => {
            filledUsers.push(user.csvFlatten());
          });
          const parser = new json2CSVParser();
          const csv = parser.parse(filledUsers);
          //res.attachment(`${eventAlias}-${Date.now()}`);
          res.setHeader('Content-disposition', 'attachment; filename=data.csv');
          res.set('Content-Type', 'text/csv');
          return res.send(csv);
        });
    });

  api.post('/admin/bulkChange', requireAuth, roleAuth(roles.ROLE_ADMIN),
    (req, res) => {
      if (!req.body.users || !req.body.status) {
        return Errors.respondUserError(res, Errors.INCORRECT_ARGUMENTS);
      }

      let users = req.body.users.split(/\n/);
      let status = req.body.status;

      return User.updateMany({_id: {$in: users}}, {status})
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(() => res.json({success: true}));
    });

  api.post('/admin/update/:eventAlias', requireAuth, roleAuth(roles.ROLE_ADMIN),
    isOrganiser, (req, res) => {
      if (!req.body.options) {
        return Errors.respondUserError(res, Errors.INCORRECT_ARGUMENTS);
      }

      let options = req.body.options;

      req.event.options = options;
      return req.event
        .save()
        .catch(err => {
          return Errors.respondError(res, err, Errors.DATABASE_ERROR);
        })
        .then(() => res.json({success : true}));
    });

  api.get('/users/:eventAlias', requireAuth, roleAuth(roles.ROLE_ADMIN),
    isOrganiser,
    (req, res) => {
      let query = User.find({event: req.event});

      return query
        .populate('account')
        .populate('event')
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(users => res.json(users));
    });

  api.post('/users/checkin/:eventAlias', requireAuth,
    roleAuth(roles.ROLE_ADMIN), isOrganiser,
    (req, res) => {
      User
        .findByIdAndUpdate(req.body.id, {'checkedIn' : true})
        .exec()
        .catch(err => {
          return Errors.respondError(res, err, Errors.DATABASE_ERROR);
        })
        .then(() => res.json({success : true}));
    });

  api.post('/users/:eventAlias/:userId', requireAuth,
    roleAuth(roles.ROLE_ADMIN), isOrganiser,
    (req, res) => {
      User.findByIdAndUpdate(req.params.userId, req.body)
        .exec()
        .catch(err => {
          return Errors.respondError(res, err, Errors.DATABASE_ERROR);
        })
        .then(() => res.json({success : true}));

    });

  api.delete('/users/:eventAlias/:userId', requireAuth,
    roleAuth(roles.ROLE_ADMIN), isOrganiser,
    (req, res) => {
      User.findByIdAndUpdate(req.params.userId, {deleted: true})
        .exec()
        .catch(err => {
          return Errors.respondError(res, err, Errors.DATABASE_ERROR);
        })
        .then(() => res.json({success: true}));
    });

  api.get('/statistics/:eventAlias', requireAuth, roleAuth(roles.ROLE_ADMIN),
    isOrganiser,
    (req, res) => {
      return Promise.all(
        [User.count({event: req.event}),
          User.distinct('university').exec(),
          User.aggregate([
            {
              $match: {event: req.event._id}
            },
            {
              $group: {_id: '$gender', count: {$sum: 1}}
            }
          ]).exec(),
          User.count({event: req.event, checkedIn: true}),
          User.aggregate([
            {
              $match: {event: req.event._id}
            },
            {
              $group : {_id: '$status', count: {$sum: 1}}
            }]).exec(),
          User.count(getResumeConditions(req))
        ])
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(values => {
          let genders = values[2].reduce((ret, gender) => {
            ret[gender._id] = gender.count;
            return ret;
          }, {});

          let status = values[4].reduce((ret, status) => {
            ret[status._id] = status.count;
            return ret;
          }, {});

          return res.json({
            count: values[0],
            universities: values[1].length,
            genders,
            checkedIn: values[3],
            status,
            resumes: values[5]
          });
        });
    });

  api.get('/admins', requireAuth, roleAuth(roles.ROLE_DEVELOPER),
    (req, res) =>
      Admin.find({deleted: {$ne: true}}).sort({createdAt: -1})
        .exec()
        .then((response) => res.json(response))
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
  );

  api.post('/admins/register', requireAuth, roleAuth(roles.ROLE_DEVELOPER),
    (req, res) =>
      Admin.create(req.body)
        .then(() =>
          res.json({success: true})
        )
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
  );

  api.get('/sponsors/applicants/:eventAlias', requireAuth,
    roleAuth(roles.ROLE_SPONSOR), isSponsor, (req, res) =>
      User.find(getResumeConditions(req),
        'firstName lastName university year gender major resume.url')
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then((users) => res.json(users))
  );

  api.post('/sponsors/download', requireAuth,
    roleAuth(roles.ROLE_SPONSOR), (req, res) =>
      User
        .find({_id: {$in: req.body.applicants}})
        .exec()
        .catch(err => {
          logging.error(err);
          return Errors.respondError(res, err, Errors.DATABASE_ERROR);
        })
        .then((users) => {
          if (users.length === 0) {
            return res.json({'error': true});
          }

          // Create a list of file names to filter by
          var fileNames = users.filter(user =>
            // Ensure a resume has been uploaded
            (user.resume != null) && (user.resume.name != null)).map(user =>
            // Map the names of the resumes
            `resumes/${user.resume.name}`
          );

          var fileName = req.user.username + '-' +
            moment().format('YYYYMMDDHHmmss') + '-' +
            generatePassword(12, false, /[\dA-F]/) + '.zip';

          let newDownload = new Download({
            fileCount: req.body.applicants.length,
            adminId: req.user._id
          });

          newDownload.save(function(err, download) {
            if (err) {
              next(err);
            }
            res.json({'downloadId': download._id});
            logging.info('Zipping started for ', download.fileCount, 'files');
          });

          zipper.localConfig.finalizing = (archive, finalize) =>
            exportApplicantInfo(users, archive, finalize);

          return zipper.zipFiles(fileNames, `downloads/${fileName}`, {
            ACL: 'public-read'
          }, function(err, result) {
            if (err) {
              logging.error(err);
              newDownload.error = true;
            } else {
              newDownload.accessUrl = result.Location;
            }
            newDownload.fulfilled = true;
            return newDownload.save();
          });
        })
        .catch(err => {
          logging.error(err);
          return Errors.respondError(res, err, Errors.S3_ERROR);
        })
  );

  api.get('/sponsors/downloads/:id', requireAuth,
    roleAuth(roles.ROLE_SPONSOR), (req, res) =>
      Download.findById(req.params.id, function(err, download) {
        if (err || download.error) {
          return res.json({'error': true});
        }
        return res.json({url: download.accessUrl});
      })
  );

  // Use API for any API endpoints
  api.get('/', (req, res) => {
    return res.json({success: true});
  });
};
