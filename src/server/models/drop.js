var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var timestamps = require('mongoose-timestamp');
var mongooseDelete = require('mongoose-delete');

var Schema = mongoose.Schema;

var ResumeDropSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Your resume drop event must have an name']
  },
  alias: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'Your resume drop event must have an alias']
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
    required: [true, 'Your resume drop event must have a logo']
  },
  closeTime: {
    type: Date,
    required: [true, 'Your resume drop event must close by a given date']
  },
  homepage: {
    type: String,
    require: [true, 'Your resume drop event must have an event page']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Your resume drop event must have a description']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'You must have a contact email']
  }
});

ResumeDropSchema.plugin(timestamps);
ResumeDropSchema.plugin(mongooseDelete);

mongoose.model('ResumeDrop', ResumeDropSchema);
