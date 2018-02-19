const mongoose = require('mongoose');

const logging = require('../config/logging');
const upload = require('../config/uploads')();
var {createEventEmail} = require('../config/mailer')();

const Errors = require('./errors')(logging);

const Event = mongoose.model('Event');
const User = mongoose.model('User');

const autoPopulateFields = [
  'password', 'firstName', 'lastName', 'gender', 'email', 'phone',
  'university', 'major', 'year', 'github', 'website', 'shareResume', 'food',
  'diet', 'shirtSize'
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

  applyManualField = (user, values, event) => {
    user.event = event;

    user.birthdate = values.birthdateYear + '-' +
      values.birthdateMonth + '-' + values.birthdateDay
      + 'T00:00:00.000Z'; // Timezone agnostic

    if (values.outOfState && values.city) {
      user.travel = {
        outOfState: values.outOfState,
        city: values.city
      };
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

    // Load event
    Event.findOne({alias: req.params.eventAlias}).exec()
      .then((found) => {
        // Ensure validated data
        validateData(req.body, res);

        event = found;
        values = req.body;

        return req.body;
      }, err => Errors.respondError(res, err, Errors.DATABASE_ERROR))
      .then((values) => User.count({email: values.email}))
      .then((count) => {
        if (count > 0) {
          throw Errors.EMAIL_IN_USE;
        }
        return true;
      })
      .then(() => applyAutoPopulate(user, values))
      .then((values) => applyManualField(user, values, event))
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
            to: user.email
          },
          locals: {
            'user': user,
            'confirmUrl': req.protocol + '://' + req.get('host') +
              '/api/confirm/' + user._id,
            'event': event
          }
        })
        .catch(err => {
          return Errors.respondError(res, err, Errors.EMAIL_ERROR);
        })
      )
      .then(() => {
        res.status(200).json({'email': user.email});

        //TODO: Refer teammates;
      })
      .catch(err => {
        console.log(err);
        return Errors.respondUserError(res, err);
      });
  });

  app.get('/confirm/:userId', (req, res) => {
    User.findByIdAndUpdate(req.params.userId, {confirmed: true})
      .populate('event')
      .exec()
      .then((user) => {
        if (!user) {
          return Errors.respondUserError(res, Errors.NO_USER_EXISTS);
        }

        return res.redirect(`/login/${user.event.alias}#confirmed`);
      })
      .catch(err => Errors.respondError(res, err, Errors.DATABASE_ERROR));
  });
};
