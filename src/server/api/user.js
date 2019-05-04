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
