import { Question } from '@Shared/ModelTypes';
import { Model, Schema, Document, model } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import { Container } from 'typedi';

export type QuestionDocument = Question & Document;
export type QuestionModel = Model<QuestionDocument>;

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         question:
 *           type: string
 *           required: true
 *           description: The question to display on the form.
 *         isRequired:
 *           type: boolean
 *           description: Indicates whether the field is required.
 */

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
}, { timestamps: true });

QuestionSchema.plugin(mongooseDelete);

export const RegisterModel = () =>
  Container.set('QuestionModel', model<QuestionDocument, QuestionModel>('Question', QuestionSchema));
