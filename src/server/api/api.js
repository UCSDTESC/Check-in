const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const json2CSVParser = require('json2csv').Parser;
const S3Archiver = require('s3-archiver');
const moment = require('moment');
const generatePassword = require('password-generator');

const upload = require('../config/uploads')();
const logging = require('../config/logging');

const {roleAuth, roles, questionTypes, getRole, isOrganiser, isSponsor,
  exportApplicantInfo, getResumeConditions, PUBLIC_EVENT_FIELDS}
  = require('./helper');
const Errors = require('./errors')(logging);

const Admin = mongoose.model('Admin');
const Download = mongoose.model('Download');
const Event = mongoose.model('Event');
const User = mongoose.model('User');
const Question = mongoose.model('Question');

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

  api.put('/admin/customQuestion/:eventAlias', requireAuth,
    roleAuth(roles.ROLE_ADMIN), isOrganiser, (req, res) => {
      if (!req.body.question) {
        return Errors.respondUserError(res, Errors.INCORRECT_ARGUMENTS);
      }

      const {question} = req.body;

      return Question
        .findByIdAndUpdate(question._id, question)
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(() => res.json({success : true}));
    });

  api.delete('/admin/customQuestion/:eventAlias', requireAuth,
    roleAuth(roles.ROLE_ADMIN), isOrganiser, (req, res) => {
      if (!req.body.question || !req.body.type) {
        return Errors.respondUserError(res, Errors.INCORRECT_ARGUMENTS);
      }

      const {question, type} = req.body;

      return Question
        .delete(question)
        .exec()
        .then(() => {
          const {customQuestions} = req.event;

          switch (type) {
          case questionTypes.QUESTION_LONG:
            customQuestions.longText.pull(question._id);
            break;
          case questionTypes.QUESTION_SHORT:
            customQuestions.shortText.pull(question._id);
            break;
          case questionTypes.QUESTION_CHECKBOX:
            customQuestions.checkBox.pull(question._id);
            break;
          default:
            return Errors.respondUserError(res, Errors.INVALID_QUESTION_TYPE);
          }

          return req.event.save();
        })
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(() => res.json({success: true}));
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

  api.post('/admin/addSponsor/:eventAlias', requireAuth,
    roleAuth(roles.ROLE_ADMIN), isOrganiser, (req, res) => {
      if (!req.body.sponsor) {
        return Errors.respondUserError(res, Errors.INCORRECT_ARGUMENTS);
      }

      return Admin.findById(req.body.sponsor)
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(sponsor => {
          req.event.sponsors.push(sponsor);
          return req.event
            .save()
            .catch(err => {
              return Errors.respondError(res, err, Errors.DATABASE_ERROR);
            })
            .then(() => res.json({success : true}));;
        });
    });

  api.post('/admin/addOrganiser/:eventAlias', requireAuth,
    roleAuth(roles.ROLE_ADMIN), isOrganiser, (req, res) => {
      if (!req.body.admin) {
        return Errors.respondUserError(res, Errors.INCORRECT_ARGUMENTS);
      }

      return Admin.findById(req.body.admin)
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(admin => {
          req.event.organisers.push(admin);
          return req.event
            .save()
            .catch(err => {
              return Errors.respondError(res, err, Errors.DATABASE_ERROR);
            })
            .then(() => res.json({success : true}));;
        });
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

  api.post('/admin/events', requireAuth,
    roleAuth(roles.ROLE_ADMIN), upload.single('logo'), (req, res) => {
      let event = new Event;
      const {closeTimeDay, closeTimeMonth, closeTimeYear} = req.body;

      ['closeTimeDay', 'closeTimeMonth', 'closeTimeYear', 'logo'].forEach(k =>
        delete req.body[k]
      );

      req.body.closeTime = closeTimeYear + '-' +
      closeTimeMonth.padStart(2, '0') + '-' +
      closeTimeDay.padStart(2, '0')
      + 'T00:00:00.000Z';

      Object.entries(req.body).forEach(([k, v]) => event[k] = v);

      if (getRole(req.user.role) === getRole(roles.ROLE_ADMIN)) {
        event.organisers = [req.user._id];
      }

      event.attach('logo', {path: req.file.path})
        .then(() => {
          event.save()
            .then(() => res.json(event))
            .catch(err => {
              if (err.name === 'ValidationError') {
                for (var field in err.errors) {
                  return Errors.respondUserError(res,
                    err.errors[field].message);
                }
              }
              return Errors.respondError(res, err, Errors.DATABASE_ERROR);
            });
        });

    });

  api.post('/admins/register', requireAuth, roleAuth(roles.ROLE_ADMIN),
    (req, res) => {
      if (getRole(req.body.role) > getRole(roles.ROLE_ADMIN) &&
        getRole(req.user.role) <= getRole(roles.ROLE_ADMIN)) {
        return Errors.respondUserError(res, Errors.PERMISSION_ERROR);
      }

      return Admin.create(req.body)
        .then((admin) =>
          res.json(admin)
        )
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR));
    }
  );

  api.get('/sponsors/applicants/:eventAlias', requireAuth,
    roleAuth(roles.ROLE_SPONSOR), isSponsor, (req, res) =>
      User.find(getResumeConditions(req),
        'firstName lastName university year gender major' +
        ' resume.url status account')
        .populate('account')
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then((users) => res.json(users))
  );

  api.post('/sponsors/download', requireAuth,
    roleAuth(roles.ROLE_SPONSOR), (req, res) => {
      return User
        .find({_id: {$in: req.body.applicants}})
        .populate('account')
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
            res.json(download);
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
        });
    }
  );

  api.get('/sponsors/downloads/:id', requireAuth,
    roleAuth(roles.ROLE_SPONSOR), (req, res) =>
      Download.findById(req.params.id, function(err, download) {
        if (err || download.error) {
          return res.json({'error': true});
        }
        return res.json(download);
      })
  );

  // Use API for any API endpoints
  api.get('/', (_, res) => {
    return res.json({success: true});
  });
};
