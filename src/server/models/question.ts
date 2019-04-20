import { Question } from '@Shared/Types';
import { Model, Schema, Document, model } from 'mongoose';
import { Container } from 'typedi';

export type QuestionDocument = Question & Document;
export type QuestionModel = Model<QuestionDocument>;

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

Container.set('QuestionModel', model<QuestionDocument>('Question', QuestionSchema));
