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

  // Use API for any API endpoints
  api.get('/', (_, res) => {
    return res.json({success: true});
  });
};
