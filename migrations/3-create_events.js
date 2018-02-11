'use strict';

module.exports.id = "create_events";

module.exports.up = function (done) {
  this.db.createCollection('events', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('events', done);
};