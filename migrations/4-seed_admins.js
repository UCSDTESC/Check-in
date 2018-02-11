'use strict';

require('dotenv').config();
var bcrypt = require('bcrypt-nodejs');

module.exports.id = "seed_admins";

const username = 'redbackthomson', password = 'password';

module.exports.up = function (done) {
  var admins = this.db.collection('admins');
  bcrypt.genSalt(process.env.SALT_ROUNDS, function(err, salt) {
    if (err) {
      return done(err);
    }

    bcrypt.hash(password, salt, null,
    function(err, hash) {
      admins.insert({
        username,
        password: hash,
        role: 'Developer'
      }, done);
    });
  });
};

module.exports.down = function (done) {
  var admins = this.db.collection('admins');
  admins.deleteOne({
    username
  }, done);
};