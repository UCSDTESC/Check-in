const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const {ADMIN_JWT_TIMEOUT, setUserInfo, roleAuth, roles} = require('./helper');

const Admin = mongoose.model('Admin');

module.exports = function(app) {
  const auth = express.Router();

  app.use('/auth', auth);

  // Middleware to require login/auth
  const requireLogin = passport.authenticate('admin', {session: false});
  const requireAuth = passport.authenticate('adminJwt', {session: false});



  /**
   * Used to verify that the JWT Token is still valid.
   */
  auth.get('/authorised', requireAuth, function (_, res) {
    return res.sendStatus(200);
  });

  // Authentication
  auth.post('/login', requireLogin, function (req, res) {
    var adminInfo = setUserInfo(req.user);

    // Update access date
    req.user.lastAccessed = new Date();
    req.user.save();

    res.status(200).json({
      token: `JWT ${generateToken(adminInfo)}`,
      user: adminInfo
    });
  });

  auth.post('/register', requireLogin, roleAuth(roles.ROLE_DEVELOPER),
    function(req, res, next) {
      if (!req.body.username || !req.body.password) {
        return next('Bad Registration: Could not find username and password');
      }

      // Check for registration errors
      const username = req.body.username;
      const password = req.body.password;

      Admin.findOne({username: username}, function(err, existingAdmin) {
        if (err) {
          return res.json(501, 'Error processing request').send({
            error: 'There was an error processing that request'
          });
        }

        // If user is not unique, return error
        if (existingAdmin) {
          return res.status(422, 'That username is already in use.')
            .send({
              error: 'That username is already in use.'
            });
        }

        var admin = new Admin({
          username,
          password
        });

        admin.save(function(err, admin) {
          if (err) {
            return next(err);
          }

          // Respond with JWT if user was created
          var adminInfo = setUserInfo(admin);

          res.status(201).json({
            token: `JWT ${generateToken(adminInfo)}`,
            user: adminInfo
          });
        });
      });
    });
};
