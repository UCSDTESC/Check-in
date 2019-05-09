import { TESCEvent } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';
import { ObjectID } from 'bson';
import { Model, Schema, Document, model } from 'mongoose';
import * as crate from 'mongoose-crate';
import * as S3 from 'mongoose-crate-s3';
import * as mongooseDelete from 'mongoose-delete';
import { Container } from 'typedi';

export type EventDocument = TESCEvent & Document & {
  attach: (name: string, options: any) => Promise<EventDocument>;
};

export type EventModel = Model<EventDocument>;

export const EventSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Your event must have an name'],
    public: true,
  },
  alias: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'Your event must have an alias'],
    public: true,
  },
  organisers: [{
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  }],
  sponsors: [{
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  }],
  closeTime: {
    type: Date,
    required: [true, 'Your event must close registrations by a given date'],
    public: true,
  },
  homepage: {
    type: String,
    required: [true, 'Your event must have an event page'],
    public: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Your event must have a description'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'You must have a contact email'],
  },
  checkinWaiver: {
    type: String,
    trim: true,
    required: false,
  },
  thirdPartyText: {
    type: String,
    trim: true,
  },
  organisedBy: {
    type: String,
    default: 'TESC',
    required: true,
    trim: true,
    public: true,
  },
  options: {
    allowHighSchool: {
      type: Boolean,
      default: false,
    },
    mlhProvisions: {
      type: Boolean,
      default: false,
    },
    allowOutOfState: {
      type: Boolean,
      default: false,
    },
    foodOption: {
      type: Boolean,
      default: false,
    },
    requireResume: {
      type: Boolean,
      default: true,
    },
    allowTeammates: {
      type: Boolean,
      default: false,
    },
    requireDiversityOption: {
      type: Boolean,
      default: false,
    },
    requireClassRequirement: {
      type: Boolean,
      default: false,
    },
    requireExtraCurriculars: {
      type: Boolean,
      default: false,
    },
    requireGPA: {
      type: Boolean,
      default: false,
    },
    requireMajorGPA: {
      type: Boolean,
      default: false,
    },
    requireWhyThisEvent: {
      type: Boolean,
      default: false,
    },
  },
  customQuestions: {
    [QuestionType.QUESTION_LONG]: [{
      type: Schema.Types.ObjectId,
      ref: 'Question',
    }],
    [QuestionType.QUESTION_SHORT]: [{
      type: Schema.Types.ObjectId,
      ref: 'Question',
    }],
    [QuestionType.QUESTION_CHECKBOX]: [{
      type: Schema.Types.ObjectId,
      ref: 'Question',
    }],
  },
}, {timestamps: true});

EventSchema.plugin(crate, {
  storage: new S3({
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    region: 'us-west-1',
    path: (attachment) => {
      return `public/logos/${attachment.name}`;
    },
  }),
  fields: {
    logo: {},
  },
});

EventSchema.plugin(mongooseDelete);

export const PUBLIC_EVENT_FIELDS: string[] = Object.entries((EventSchema as any).paths)
  .filter(([fieldName, field]: any) => 'public' in field.options)
  .map(([fieldName, field]: any) => fieldName);
PUBLIC_EVENT_FIELDS.push('logo');

export const RegisterModel = () =>
  Container.set('EventModel', model<EventDocument, EventModel>('Event', EventSchema));
