const mongoose = require('mongoose');

const logging = require('../config/logging');
const upload = require('../config/uploads')();
var {createEventEmail} = require('../config/mailer')();

const Errors = require('./errors')(logging);

const Event = mongoose.model('Event');
const User = mongoose.model('User');
const Account = mongoose.model('Account');

module.exports = function(app) {
  app.get('/confirm/:userId', (req, res) => {
    Account.findByIdAndUpdate(req.params.userId, {confirmed: true})
      .populate('event')
      .exec()
      .then((user) => {
        if (!user) {
          return Errors.respondUserError(res, Errors.NO_USER_EXISTS);
        }

        return res.redirect('/login#confirmed');
      })
      .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR));
  });

  app.get('/verify/:email', (req, res) => {
    return Account.count({email: {
      $regex: new RegExp(req.params.email, 'i')
    }})
      .exec()
      .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
      .then(count => res.json({exists: (count !== 0)}));
  });
};
