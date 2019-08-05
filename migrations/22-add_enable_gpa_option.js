'use strict';

module.exports.id = "add_enable_gpa_option";

module.exports.up = function (done) {
  var events = this.db.collection('events');
  events.updateMany({}, { $set: { 'options.enableGPA': false } }, done);
};

module.exports.down = function (done) {
  var events = this.db.collection('events');
  events.updateMany({}, { $unset: { 'options.enableGPA': 1 } }, done);
};