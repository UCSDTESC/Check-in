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
  alias: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'Your event must have an alias']
  },
  organisers: [{
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  }],
  sponsors: [{
    type: Schema.Types.ObjectId,
    ref: 'Admin'
  }],
  logo: {
    type: String,
    trim: true,
    required: [true, 'Your event must have a logo']
  },
  closeTime: {
    type: Date,
    required: [true, 'Your event must close registrations by a given date']
  },
  homepage: {
    type: String,
    require: [true, 'Your event must have an event page']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Your event must have a description']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'You must have a contact email']
  },
  checkinWaiver: {
    type: String,
    trim: true,
    required: false
  },
  options: {
    allowHighSchool: {
      type: Boolean,
      default: false
    },
    mlhProvisions: {
      type: Boolean,
      default: false
    },
    allowOutOfState: {
      type: Boolean,
      default: false
    },
    foodOption: {
      type: Boolean,
      default: false
    },
    requireResume: {
      type: Boolean,
      default: true
    },
    allowTeammates: {
      type: Boolean,
      default: false
    }
  }
});

EventSchema.plugin(timestamps);
EventSchema.plugin(mongooseDelete);

mongoose.model('Event', EventSchema);
