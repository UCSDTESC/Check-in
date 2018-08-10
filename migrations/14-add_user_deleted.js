'use strict';

module.exports.id = 'add_user_deleted';

module.exports.up = function (done) {
  var users = this.db.collection('users');

  users.findOneAndUpdate({alias: 'hackxx'}, {$set:{deleted: false}}, done);
};

module.exports.down = function (done) {
  var users = this.db.collection('users');

  users.update({alias: 'hackxx'}, {$unset: {delete: 1}}, done);
};
