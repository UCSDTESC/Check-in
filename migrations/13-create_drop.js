'use strict';

module.exports.id = 'create_drop';

module.exports.up = function (done) {
  this.db.createCollection('resumedrops', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('resumedrops', done);
};
