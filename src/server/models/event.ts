import { QuestionType } from '@Shared/Questions';
import { TESCEvent } from '@Shared/Types';
import { Model, Schema, Document, model } from 'mongoose';
import crate from 'mongoose-crate';
import S3 from 'mongoose-crate-s3';
import { Container } from 'typedi';

export type EventDocument = TESCEvent & Document;
export type EventModel = Model<EventDocument>;

const EventSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Your event must have an name'],
  },
  alias: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'Your event must have an alias'],
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
  },
  homepage: {
    type: String,
    required: [true, 'Your event must have an event page'],
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

Container.set('EventModel', model<EventDocument>('Event', EventSchema));
