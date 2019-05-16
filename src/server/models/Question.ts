import { Question } from '@Shared/ModelTypes';
import { Model, Schema, Document, model } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
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

QuestionSchema.plugin(mongooseDelete);

export const RegisterModel = () =>
  Container.set('QuestionModel', model<QuestionDocument, QuestionModel>('Question', QuestionSchema));
