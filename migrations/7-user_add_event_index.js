'use strict';

module.exports.id = 'user_add_event_index';

module.exports.up = function (done) {
  this.db.collection('users').createIndex({
    event: 1
  }, done);
};

module.exports.down = function (done) {
  this.db.collection('users').dropIndex({
    event: 1
  }, done);
};
