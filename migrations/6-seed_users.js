'use strict';

require('dotenv').config();
var bcrypt = require('bcrypt-nodejs');

module.exports.id = 'seed_users';

const email = 'FakeEmail@email.com';

module.exports.up = function (done) {
  var events = this.db.collection('events');
  var users = this.db.collection('users');

  bcrypt.genSalt(process.env.SALT_ROUNDS, function(err, salt) {
    if (err) {
      return done(err);
    }

    bcrypt.hash('password', salt, null,
      function(err, hash) {
        events.findOne({alias: 'hackxx'})
          .then((event) => {
            users.insert({
              event: event._id,
              email,
              firstName: 'Fake',
              lastName: 'Person',
              gender: 'Male',
              pronoun: 'He/Him/His',
              phone: '0000000000',
              university: 'Fake University',
              password: hash
            }, done);
          })
          .catch(done);
      });
  });
};

module.exports.down = function (done) {
  var users = this.db.collection('users');
  users.deleteOne({email}, done);
};
