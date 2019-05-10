'use strict';

module.exports.id = 'add_account_resets';

module.exports.up = function (done) {
  this.db.createCollection('accountresets', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('accountresets', done);
};
