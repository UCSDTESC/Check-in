'use strict';

module.exports.id = 'add_empty_custom_responses';

/*
"customQuestionResponses": {},
*/

module.exports.up = function (done) {
  var users = this.db.collection('users');
  users.updateMany({}, {$set: {'customQuestionResponses': {}}}, done);
};

module.exports.down = function (done) {
  var users = this.db.collection('users');
  users.updateMany({}, {$unset:{'customQuestionResponses': {}}}, done);
};
