'use strict';

module.exports.id = "create_users";

module.exports.up = function (done) {
  this.db.createCollection('users', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('users', done);
};