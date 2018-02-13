'use strict';

module.exports.id = 'create_admins';

module.exports.up = function (done) {
  this.db.createCollection('admins', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('admins', done);
};
