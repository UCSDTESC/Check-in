'use strict';

module.exports.id = 'add_third_party_fields';

const thirdPartyText = 'Operated By The Triton Engineering Student Council.'
const organisedBy = 'TESC'
module.exports.up = function (done) {
    var events = this.db.collection('events');
    events.updateMany({}, {$set: {organisedBy}}, done);
};

module.exports.down = function(done) {
    var events = this.db.collection('events');
    events.update({}, {$unset: {thirdPartyText: 1, organisedBy: 1}}, done);
}
