'use strict';

module.exports.id = 'seed_drop';

const name = 'Espresso';

module.exports.up = function (done) {
  var resumedrop = this.db.collection('resumedrops');
  var admins = this.db.collection('admins');
  let closeTime = new Date(Date.now() + 5*365*24*60*60*1000);

  admins.findOne({username: 'redbackthomson'})
    .then((admin) => {
      resumedrop.insert({
        name,
        alias: 'espresso',
        logo: 'https://s3-us-west-1.amazonaws.com/tesc-checkin/public/' +
          'logos/hackxx.png',
        organisers: [admin._id],
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        email: "espresso@email.com",
        closeTime
      }, done);
    })
    .catch(done);
};

module.exports.down = function (done) {
  var resumedrop = this.db.collection('resumedrops');
  resumedrop.deleteOne({name}, done);
};
