const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const logging = require('../config/logging');
const upload = require('../config/uploads')();
var {createTESCEmail} = require('../config/mailer')();

const {setUserInfo} = require('./helper');
const Errors = require('./errors')(logging);

const User = mongoose.model('User');
const Event = mongoose.model('Event');
const Account = mongoose.model('Account');

const editableFields = [
  'teammates', 'food', 'diet', 'travel', 'shirtSize', 'github', 'website',
  'shareResume', 'gender'
];
const readOnlyFields = [
  'status', 'firstName', 'lastName', 'university', 'email', 'phone', 'resume',
  'availableBus', 'bussing'
];

module.exports = function(app) {
  const userRoute = express.Router();

  app.use('/user', userRoute);

  // Middleware to require login/auth
  const requireLogin = passport.authenticate('user', {session: false});
  const requireAuth = passport.authenticate('userJwt', {session: false});

  /**
   * Signs a user with the JWT secret.
   * @param {Object} user The public user information to sign.
   * @returns {String} The JWT token signed for that user.
   */
  function generateToken(user) {
    return jwt.sign(user, process.env.SESSION_SECRET, {
      expiresIn: 10080
    });
  }

  /**
   * Returns an output object that has profile fields of the user.
   * @param {Object} user The user object to output.
   */
  function outputCurrentUser(user) {
    var outputUser = {};
    [... editableFields, ...readOnlyFields].forEach(function(field) {
      outputUser[field] = user[field];
    });
    return outputUser;
  }

  // Authentication
  userRoute.post('/login', requireLogin, function (req, res) {
    var userInfo = setUserInfo(req.user);

    res.status(200).json({
      token: `JWT ${generateToken(userInfo)}`,
      user: userInfo
    });
  });

  userRoute.post('/forgot', function (req, res) {
    if (!req.body.email) {
      return Errors.respondUserError(res, Errors.INCORRECT_ARGUMENTS);
    }

    return Account.findOne({email: req.body.email}, function(e, account) {
      if (e || account === null) {
        return Errors.respondUserError(res, Errors.NO_USER_EXISTS);
      }

      return createTESCEmail()
        .send({
          template: 'forgot',
          message: {
            to: account.email
          },
          locals: {
            'account': account,
            'resetUrl': req.protocol + '://' + req.get('host') +
              '/user/reset/' + account._id
          }
        })
        .catch(err => {
          return Errors.respondError(res, err, Errors.EMAIL_ERROR);
        })
        .then(() => {
          return res.json({success: true});
        });
    });
  });

  userRoute.post('/reset', function(req, res) {
    if (!req.body.id || !req.body.newPassword) {
      return Errors.respondUserError(res, Errors.INCORRECT_ARGUMENTS);
    }

    const password = req.body.newPassword;

    return Account.findById(req.body.id, function(e, user) {
      if (e || user === null) {
        return Errors.respondUserError(res, Errors.NO_USER_EXISTS);
      }

      user.password = password;
      user.save();
      return res.json({success: true});
    });

  });

  userRoute.get('/current/:eventAlias', requireAuth, function(req, res) {
    Event.findOne({alias: req.params.eventAlias})
      .then((event) => {
        return User
          .findOne({account: req.user, event})
          .populate('event')
          .exec();
      })
      .then(obj => res.json(obj))
      .catch(() => {
        return Errors.respondUserError(res, Errors.USER_NOT_REGISTERED);
      });
  });

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
            {$set: updateDelta}, {new: true});
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
