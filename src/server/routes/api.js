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
  require('./registration')(api);

  addEventStatistics = (events) => {
    return new Promise((resolve) => {
      newEvents = [];
      updated = 0;

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

  api.get('/events', requireAuth, roleAuth(roles.ROLE_ADMIN),
    (req, res) => {
      var query = Event.find({'organisers': req.user});
      if (getRole(req.user.role) >= getRole(roles.ROLE_DEVELOPER)) {
        query = Event.find();
      }
      return query
        .populate('organisers')
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(addEventStatistics)
        .then(events => res.json(events));
    });

  api.get('/events/:eventAlias',
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
            alias: event.alias
          });
        });
    });

  api.get('/users/:eventAlias', requireAuth, roleAuth(roles.ROLE_ADMIN),
    isOrganiser,
    (req, res) => {
      return User.find({event: req.event})
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(res.json);
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
          ]).exec()
        ])
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(values => {
          let genders = values[2].reduce((ret, gender) => {
            ret[gender._id] = gender.count;
            return ret;
          }, {});

          return res.json({
            count: values[0],
            universities: values[1].length,
            genders
          });
        });
    });

  api.get('/admins', requireAuth, roleAuth(roles.ROLE_DEVELOPER),
    (req, res) =>
      Admin.find({deleted: {$ne: true}}).sort({createdAt: -1})
        .exec()
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
        .then(res.json)
  );

  // Use API for any API endpoints
  api.get('/', (req, res) => {
    return res.json({success: true});
  });
};
