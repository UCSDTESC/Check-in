import { Question } from 'Shared/types';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

type QuestionType = Question & mongoose.Document;

const QuestionSchema = new Schema({
  question: {
    type: String,
    trim: true,
    required: [true, 'You must specify a question'],
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
},{timestamps: true});

export const QuestionModel = mongoose.model<QuestionType>('Question', QuestionSchema);
