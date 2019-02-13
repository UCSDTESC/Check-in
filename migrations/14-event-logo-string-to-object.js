'use strict';

module.exports.id = 'event-logo-string-to-object';

module.exports.up = function(done) {
  var events = this.db.collection('events');

  events.find().toArray()
    .then(a => {
      let length = a.length;

      a.forEach((e, i) => {
        e.logo = {url: e.logo};
        events.save(e);
        if (i === length - 1) {
          done();
        }
      });

    })
    .catch(done);
};


module.exports.down = function (done) {
  var events = this.db.collection('events');

  events.find().toArray()
    .then(a => {
      let length = a.length;

      a.forEach((e, i) => {
        e.logo = e.logo.url;
        events.save(e);
        if (i === length - 1) {
          done();
        }
      });

    })
    .catch(done);
};
