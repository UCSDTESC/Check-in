const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const logging = require('../config/logging');

const {roleAuth, roles, getRole, isOrganiser} = require('./helper');
const Errors = require('./errors')(logging);

const Admin = mongoose.model('Admin');
const Event = mongoose.model('Event');
const User = mongoose.model('User');

const requireAuth = passport.authenticate('adminJwt', {session: false});

module.exports = function(app) {
  const api = express.Router();

  app.use('/api', api);
  require('./auth')(api);

  api.get('/events', requireAuth, roleAuth(roles.ROLE_ADMIN),
    (req, res) => {
      if (getRole(req.user.role) >= getRole(roles.ROLE_DEVELOPER)) {
        return Event.find().populate('organisers').exec((err, events) => {
          if (err) {
            return Errors.respondError(res, err, Errors.DATABASE_ERROR);
          }
          return res.json(events);
        });
      }
      return Event.find({'organisers': req.user})
        .populate('organisers')
        .exec((err, events) => {
          if (err) {
            return Errors.respondError(res, err, Errors.DATABASE_ERROR);
          }
          return res.json(events);
        });
    });

  api.get('/events/:eventAlias',
    (req, res) => {
      return Event.findOne({'alias': req.params.eventAlias})
        .exec((err, event) => {
          if (err) {
            return Errors.respondError(res, err, Errors.DATABASE_ERROR);
          }
          if (!event) {
            return Errors.respondUserError(res, Errors.NO_ALIAS_EXISTS);
          }
          return res.json({
            _id: event._id,
            name: event.name,
            logo: event.logo,
            alias: event.alias
          });
        });
    });

  api.get('/users/:eventAlias', requireAuth, roleAuth(roles.ROLE_ADMIN),
    isOrganiser,
    (req, res) => {
      return User.find({event: req.event}).exec(function(err, users) {
        if (err) {
          return Errors.respondError(res, err, Errors.DATABASE_ERROR);
        }

        return res.json(users);
      });
    });

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
