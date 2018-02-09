const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const logging = require('../config/logging');

const {setUserInfo, roleAuth, roles, getRole} = require('../helper');
const Admin = mongoose.model('Admin');
const Event = mongoose.model('Event');

const requireAuth = passport.authenticate('adminJwt', {session: false});

module.exports = function(app) {
  const api = express.Router();

  app.use('/api', api);
  require('./auth')(api);

  api.get('/events', requireAuth, roleAuth(roles.ROLE_ADMIN),
  (req, res) => {
    if(getRole(req.user.role) >= getRole(roles.ROLE_DEVELOPER)) {
      return Event.find().populate('organisers').exec((err, events) => {
        return res.json(events);
      });
    }
    return Event.find({"organisers": req.user})
    .populate('organisers')
    .exec((err, events) => {
      if(err) {
        logging.error(err);
        return res.json({error: true});
      }
      return res.json(events);
    });
  })

  api.get('/admins', requireAuth, roleAuth(roles.ROLE_DEVELOPER),
  (req, res) =>
    Admin.find({deleted: {$ne: true}}).sort({createdAt: -1})
    .exec(function(err, admins) {
      return res.json(admins);
    })
  );

  // Use API for any API endpoints
  api.get('/', (req, res) => {
    return res.json({success: true});
  });
};