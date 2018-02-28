const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const {setUserInfo} = require('./helper');

const User = mongoose.model('User');

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

  // Authentication
  userRoute.post('/login', requireLogin, function (req, res) {
    var userInfo = setUserInfo(req.user);

    res.status(200).json({
      token: `JWT ${generateToken(userInfo)}`,
      user: userInfo
    });
  });

  userRoute.get('/current/:eventAlias', requireAuth, function(req, res) {
    return res.json(req.user);
  });
};
