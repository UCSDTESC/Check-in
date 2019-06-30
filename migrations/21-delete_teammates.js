'use strict';

module.exports.id = "delete_teammates";

module.exports.up = function (done) {
  var users = this.db.collection('users');
  users.updateMany({}, { $unset: { 'teammates': "" } }, done);
};

module.exports.down = function (done) {
  var users = this.db.collection('users');
  users.updateMany({}, { $set: { 'teammates': [] } }, done);
};