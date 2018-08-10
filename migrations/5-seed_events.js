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
        logo: 'https://s3-us-west-1.amazonaws.com/tesc-checkin/public/' +
          'logos/hackxx.png',
        organisers: [admin._id],
        description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        email: 'FakeEvent@email.com'
      }, done);
    })
    .catch(done);
};

module.exports.down = function (done) {
  var events = this.db.collection('events');
  events.deleteOne({name}, done);
};
