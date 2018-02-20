'use strict';

module.exports.id = 'add_event_registration_close';

module.exports.up = function (done) {
  var events = this.db.collection('events');

  // 5 year's time
  let closeTime = new Date(Date.now() + 5*365*24*60*60*1000);
  events.findOneAndUpdate({alias: 'hackxx'}, {$set:{closeTime}}, done);
};

module.exports.down = function (done) {
  var events = this.db.collection('events');

  events.update({alias: 'hackxx'}, {$unset: {closeTime: 1}}, done);
};
