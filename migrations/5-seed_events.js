'use strict';

module.exports.id = 'seed_events';

const name = 'HackXX';

module.exports.up = function (done) {
  var events = this.db.collection('events');
  var admins = this.db.collection('admins');

  admins.findOne({username: 'redbackthomson'})
    .then((admin) => {
      events.insert({
        name,
        alias: 'hackxx',
        logo: 'http://hackxx.sdhacks.io/images/logo.png',
        organisers: [admin._id]
      }, done);
    })
    .catch(done);
};

module.exports.down = function (done) {
  var events = this.db.collection('events');
  events.deleteOne({name}, done);
};
