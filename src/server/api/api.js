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

  // Use API for any API endpoints
  api.get('/', (_, res) => {
    return res.json({success: true});
  });
};
