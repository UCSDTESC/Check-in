'use strict';

module.exports.id = 'create_accounts';

module.exports.up = function (done) {
  this.db.createCollection('accounts', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('accounts', done);
};
