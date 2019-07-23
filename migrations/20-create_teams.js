'use strict';

module.exports.id = 'create_teams';

module.exports.up = function (done) {
  this.db.createCollection('teams', done);
};

module.exports.down = function (done) {
  this.db.dropCollection('teams', done);
};
