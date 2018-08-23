const mongoose = require('mongoose');

const logging = require('../config/logging');
const upload = require('../config/uploads')();
var {createEventEmail} = require('../config/mailer')();

const Errors = require('./errors')(logging);

const Event = mongoose.model('Event');
const User = mongoose.model('User');
const Account = mongoose.model('Account');

const autoPopulateFields = [
  'firstName', 'lastName', 'gender', 'phone',
  'university', 'major', 'year', 'github', 'website', 'shareResume', 'food',
  'diet', 'shirtSize', 'pid', 'race', 'highSchool'
];

module.exports = function(app) {
  validateData = (values, res) => {
    if (values.phone) {
      values.phone = values.phone.replace(/\D/g, '');
      if (values.phone.length !== 10) {
        throw Errors.respondUserError(res, Errors.PHONE_NUMBER_INVALID);
      }
    }
  };

  applyAutoPopulate = (user, values) => {
    autoPopulateFields.forEach(field => {
      if (values[field]) {
        user[field] = values[field];
      }
    });
    return values;
  };

  applyManualField = (user, values, event, account) => {
    user.event = event;
    user.account = account;

    user.birthdate = values.birthdateYear + '-' +
      values.birthdateMonth.padStart(2, '0') + '-' +
      values.birthdateDay.padStart(2, '0')
      + 'T00:00:00.000Z'; // Timezone agnostic

    if (values.outOfState && values.city) {
      user.travel = {
        outOfState: values.outOfState,
        city: values.city
      };
    }

    if (values.institution === 'ucsd') {
      user.institution = 'uni';
      user.university = 'The University of California, San Diego';
    }

    user.teammates = [];

    if (values.team1) {
      user.teammates.push(values.team1.toLowerCase());
    }
    if (values.team2) {
      user.teammates.push(values.team2.toLowerCase());
    }
    if (values.team3) {
      user.teammates.push(values.team3.toLowerCase());
    }

    return values;
  };

  app.post('/register/:eventAlias', upload.single('resume'), (req, res) => {
    var user = new User;
    let event = undefined;
    let values = undefined;
    let account = undefined;

    // Load event
    Event.findOne({alias: req.params.eventAlias}).exec()
      .then((found) => {
        // Ensure validated data
        validateData(req.body, res);

        event = found;
        values = req.body;

        return req.body;
      }, err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
      .then((values) => Account.findOne({email: {
        $regex: new RegExp(values.email, 'i')
      }}))
      .then((foundAccount) => {
        if (foundAccount) {
          account = foundAccount;
          return false;
        }
        return new Account({
          email: values.email,
          password: values.password
        }).save();
      })
      .then((newAccount) => {
        if (!newAccount) {
          return;
        }
        account = newAccount;
        return true;
      })
      .then(() => applyAutoPopulate(user, values))
      .then((populatedValues) =>
        applyManualField(user, populatedValues, event, account))
      .then(() => {
        if (!user.university && user.highSchool) {
          throw Errors.INSTITUTION_NOT_PROVIDED
        }
      })
      .then(() => User.count({account, event}))
      .then((count) => {
        if (count !== 0) {
          throw Errors.USER_ALREADY_REGISTERED;
        }
        return true;
      })
      .then(() => {
        if (req.file) {
          return user.attach('resume', {path: req.file.path});
        }

        return user;
      })
      .then(() => {
        return user.save()
          .catch(err => {
            if (err.name === 'ValidationError') {
              for (var field in err.errors) {
                return Errors.respondUserError(res, err.errors[field].message);
              }
            }

            return Errors.respondError(res, err, Errors.DATABASE_ERROR);
          });
      })
      .then(() => createEventEmail(event)
        .send({
          template: 'confirmation',
          message: {
            to: `"${user.firstName} ${user.lastName}" <${account.email}>`
          },
          locals: {
            'user': user,
            'confirmUrl': req.protocol + '://' + req.get('host') +
              '/api/confirm/' + account._id,
            'event': event
          }
        })
        .catch(err => {
          return Errors.respondError(res, err, Errors.EMAIL_ERROR);
        })
      )
      .then(() => {
        res.status(200).json({'email': account.email});

        //TODO: Refer teammates;
      })
      .catch(err => {
        console.log(err);
        return Errors.respondUserError(res, err);
      });
  });

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
