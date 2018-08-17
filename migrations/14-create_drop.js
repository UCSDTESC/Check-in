'use strict';

module.exports.id = 'create_drop';

module.exports.up = function (done) {
  this.db.createCollection('drops', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('drops', done);
};
