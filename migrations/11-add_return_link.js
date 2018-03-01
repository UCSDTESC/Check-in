'use strict';

module.exports.id = 'add_return_link';

module.exports.up = function (done) {
  var events = this.db.collection('events');

  let homepage = 'https://hackxx.sdhacks.io';
  events.findOneAndUpdate({alias: 'hackxx'}, {$set:{homepage}}, done);
};

module.exports.down = function (done) {
  var events = this.db.collection('events');

  events.update({alias: 'hackxx'}, {$unset: {homepage: 1}}, done);
};
