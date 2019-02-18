var mongoose = require('mongoose');
var mongooseDelete = require('mongoose-delete');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  question: {
    type: String,
    trim: true,
    required: [true, 'Your Question Must Have A Question Text']
  },
  isRequired: {
    type: Boolean,
    default: false
  }
},{timestamps: true});

QuestionSchema.plugin(mongooseDelete);
mongoose.model('Question', QuestionSchema);
