'use strict';

module.exports.id = 'create_downloads';

module.exports.up = function (done) {
  this.db.createCollection('downloads', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('downloads', done);
};
