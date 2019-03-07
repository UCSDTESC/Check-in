'use strict';

module.exports.id = 'create_questions';

module.exports.up = function (done) {
  this.db.createCollection('questions', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('questions', done);
};
