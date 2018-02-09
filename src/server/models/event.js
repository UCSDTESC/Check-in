var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var timestamps = require('mongoose-timestamp');
var mongooseDelete = require('mongoose-delete');

var Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Your event must have an name']
  },
  organisers: [{
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  }],
  logo: {
    type: String,
    trim: true,
    required: [true, 'Your event must have a logo']
  }
});

EventSchema.plugin(timestamps);
EventSchema.plugin(mongooseDelete);

mongoose.model('Event', EventSchema);