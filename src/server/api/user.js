const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const logging = require('../config/logging');
const upload = require('../config/uploads')();
var {createTESCEmail} = require('../config/mailer')();

const {setUserInfo, PUBLIC_EVENT_FIELDS, USER_JWT_TIMEOUT} =
  require('./helper');
const Errors = require('./ErrorHandler')(logging);

const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Account = mongoose.model('Account');

module.exports = function(app) {
  const userRoute = express.Router();

  app.use('/user', userRoute);

  // Middleware to require login/auth
  const requireAuth = passport.authenticate('userJwt', {session: false});

  userRoute.post('/update/:eventAlias', upload.single('resume'), requireAuth,
    function(req, res) {
      var user = req.user;
      const delta = req.body;
      logging.info(`User ${user._id} has updated ${Object.keys(delta).length} `+
      'fields in their profile');

      // Ensure final delta is only editing editable fields.
      var updateDelta = {};
      Object.keys(delta).forEach(function(field) {
        if (editableFields.indexOf(field) !== -1) {
          updateDelta[field] = delta[field];
        }
      });

      return Event.findOne({alias: req.params.eventAlias})
        .then((event) => {
          return User.findOneAndUpdate({account: user, event: event},
            {$set: updateDelta}, {new: true})
            .populate('account')
            .populate('event');
        })
        .then((user) => {
          if (!user) {
            return Errors.respondUserError(res, Errors.NO_USER_EXISTS);
          }

          if (req.file) {
            return user.attach('resume', {path: req.file.path}, (error) =>{
              if (error) {
                logging.error(error);
                return Errors.respondUserError(res, Errors.RESUME_UPDATE_ERROR);
              }
              user.save();
              return res.json(outputCurrentUser(user));
            });
          }
          return res.json(outputCurrentUser(user));
        })
        .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR));
    });

  userRoute.post('/rsvp/:eventAlias', requireAuth, function(req, res) {
    const user = req.user;

    if (req.body.status === undefined) {
      return Errors.respondUserError(res, Errors.NO_STATUS_SENT);
    }

    const {status, bussing} = req.body;
    const newStatus = status ? 'Confirmed' : 'Declined';
    const newBussing = user.availableBus && bussing;

    return Event.findOne({alias: req.params.eventAlias})
      .then((event) => {
        return User.findOneAndUpdate({account: user, event: event},
          {$set: {
            status: newStatus,
            bussing: newBussing
          }}, {new: true})
          .populate('event')
          .exec();
      })
      .then((user) => {
        return res.json(user);
      })
      .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR));
  });
};
