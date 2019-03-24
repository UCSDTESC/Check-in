const mongoose = require('mongoose');

const logging = require('../config/logging');
var {sendAcceptanceEmail} = require('../config/mailer')();

const Errors = require('./errors')(logging);

const Event = mongoose.model('Event');


module.exports = function(app) {
  app.post('/mail/acceptance', (req, res) => {
    const {forEvent, toEmail} = req.body;

    Event
      .findById(forEvent)
      .exec()
      .catch(console.error)
      .then((e) => {
        sendAcceptanceEmail('s1panda@ucsd.edu', e)
          .then(() => {
            console.log('Sent!');
          })
          .catch((e) => {
            console.dir(e.response.body.errors);
          });
      });
  });
};
