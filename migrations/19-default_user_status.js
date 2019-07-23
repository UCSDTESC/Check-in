'use strict';

module.exports.id = "default_user_status";

module.exports.up = function (done) {
  var users = this.db.collection('users');
  users.updateMany({
    status: { $exists: false }
  }, {
      $set: { status: 'None' }
    }, done);
};

module.exports.down = function (done) {
  var users = this.db.collection('users');
  users.updateMany({
    status: 'None'
  }, {
      $unset: { status: '' }
    }, done);
};