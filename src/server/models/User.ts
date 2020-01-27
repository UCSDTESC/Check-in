import ResumeService from '@Services/ResumeService';
import { TESCUser } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';
import { Model, Schema, Document, model } from 'mongoose';
import * as crate from 'mongoose-crate';
import * as S3 from 'mongoose-crate-s3';
import * as mongooseDelete from 'mongoose-delete';
import * as mongooseSanitizer from 'mongoose-sanitizer';
import { Container } from 'typedi';
import { print } from 'util';
import { generateQRCodeURL } from '@Shared/QRCodes';

export type UserDocument = TESCUser & Document & {
  csvFlatten: (isSponsor? : boolean, emailsOnly? : boolean) => any;
  //csvFlattenForEmails: () => any;
  attach: (name: string, options: any) => Promise<UserDocument>;
};
export type UserModel = Model<UserDocument>;

export const UserSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    public: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    public: true,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    public: true,
  },
  // Declares the user's first name
  firstName: {
    type: String,
    trim: true,
    required: [true, 'You must have a first name'],
    displayName: 'First Name',
    public: true,
  },
  // Declares the user's last name
  lastName: {
    type: String,
    trim: true,
    required: [true, 'You must have a last name'],
    displayName: 'Last Name',
    public: true,
  },
  // Declares the user's birth date
  birthdate: {
    type: Date,
    required: [true, 'You must have a birthdate'],
    displayName: 'Birthdate',
    public: true,
  },
  // Declares the user's gender
  gender: {
    type: String,
    required: [true, 'You must have a gender'],
    displayName: 'Gender',
    public: true,
    editable: true,
  },
  // Declares the user's phone number
  phone: {
    type: String,
    required: [true, 'You must have a phone number'],
    displayName: 'Phone',
    public: true,
  },
  // Declares which university the user attends
  university: {
    type: String,
    trim: true,
    displayName: 'University',
    public: true,
  },
  // Declares which high school the user attends
  highSchool: {
    type: String,
    trim: true,
    displayName: 'High School',
    public: true,
  },
  // Declares the UCSD student ID
  pid: {
    type: String,
    trim: true,
    displayName: 'PID',
    public: true,
  },
  // Declares which major the user has specified
  major: {
    type: String,
    trim: true,
    displayName: 'Major',
    public: true,
  },
  // Declares which year the student is currently attending
  year: {
    type: String,
    displayName: 'Year',
    public: true,
  },
  // Declares the user's Github account name
  github: {
    type: String,
    trim: true,
    required: false,
    displayName: 'Github',
    public: true,
    editable: true,
  },
  // Declares the user's personal website link
  website: {
    type: String,
    trim: true,
    required: false,
    displayName: 'Website',
    public: true,
    editable: true,
  },
  // Declares whether the user has given permission for their resume to be
  // shared
  shareResume: {
    type: Boolean,
    default: false,
    displayName: 'Share Resume',
    public: true,
    editable: true,
  },
  // Declares the food that the user has requested
  food: {
    type: String,
    trim: true,
    displayName: 'Food',
    public: true,
    editable: true,
  },
  // Declares what dietary requirements the user has
  diet: {
    type: String,
    trim: true,
    displayName: 'Diet',
    public: true,
    editable: true,
  },
  // Declares the size of the shirt that the user has requested
  shirtSize: {
    type: String,
    displayName: 'Shirt Size',
    public: true,
    editable: true,
  },
  travel: {
    // Declares whether the user will be travelling from outside of the state
    outOfState: {
      type: Boolean,
      default: false,
      public: true,
      editable: true,
    },
    // Declares which city the user will be travelling from
    city: {
      type: String,
      public: true,
      editable: true,
    },
  },
  // Declares the name of the bus that the user can take
  availableBus: {
    type: String,
    trim: true,
    displayName: 'Available Bus',
    public: true,
  },
  // Declares whether the user has noted they will be taking the bus
  bussing: {
    type: Boolean,
    default: false,
    displayName: 'Bussing',
    public: true,
  },
  // Declares the user's current application status
  // Rejected, Unconfirmed, Confirmed, Declined, Late, and Waitlisted
  status: {
    type: String,
    required: true,
    trim: true,
    displayName: 'Status',
    public: true,
    enum: Object.values(UserStatus),
    default: UserStatus.NoStatus,
  },
  // Declares that the user has checked into the event on the day
  checkedIn: {
    type: Boolean,
    default: false,
    displayName: 'Checked In',
  },
  // Declares that the user's information is ready for sponsor consumption
  sanitized: {
    type: Boolean,
    default: false,
    displayName: 'Sanitized',
  },
  // Declares the user's provided race, required by events on an optional basis
  race: {
    type: String,
    required: false,
    displayName: 'Race',
  },
  // Declares whether or not the user has taken the class specified in the
  // application
  classRequirement: {
    type: Boolean,
    default: false,
    displayName: 'Class Requirement',
  },
  // Declares the user's specified extra curriculars
  extraCurriculars: {
    type: String,
    trim: true,
    displayName: 'Extra Curriculars',
  },
  // Declares the user's GPA, required by events on an optional basis
  gpa: {
    type: String,
    required: false,
    displayName: 'GPA',
    public: true,
    editable: true,
  },
  // Declares the user's major GPA, required by events on an optional basis
  majorGPA: {
    type: String,
    required: false,
    displayName: 'Major GPA',
    public: true,
    editable: true,
  },
  // Declares the user's responses to the event's custom questions
  customQuestionResponses: {
    type: Map,
    of: 'String',
    public: true,
  },

  whyEventResponse: {
    type: String,
    required: false,
    displayName: 'Why This Event?',
    public: true,
  },
}, { timestamps: true });

UserSchema.plugin(mongooseSanitizer);
UserSchema.plugin(crate, {
  storage: new S3({
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    region: 'us-west-1',
    path: (attachment) => {
      return `${ResumeService.filePrefix}${attachment.name}`;
    },
  }),
  fields: {
    resume: {},
  },
});

UserSchema.method('csvFlatten', function (isSponsor = false, emailsOnly = false) {
  // tslint:disable-next-line:no-invalid-this no-this-assignment
  const user = this;
  let autoFill = ['_id', 'firstName', 'lastName', 'email', 'birthdate',
    'gender', 'phone', 'university', 'pid', 'major', 'year', 'github',
    'website', 'shareResume', 'food', 'diet', 'shirtSize', 'availableBus',
    'bussing', 'teammates', 'status', 'checkedIn', 'createdAt', 'updatedAt'];

  if (isSponsor) {
    autoFill =  ['firstName', 'lastName', 'email', 'phone', 
      'university', 'major', 'year', 'github', 'website', 'gpa', 'majorGPA'];
  }

  if (emailsOnly) {
    autoFill = ['firstName', 'lastName', 'email'];
  }

  let autoFilled: any = autoFill.reduce((acc, val) => {
    return Object.assign(acc, { [val]: user[val] });
  }, {});

  autoFilled.email = user.account ? user.account.email : '';

  if (!emailsOnly) {
    autoFilled.outOfState = user.travel.outOfState;
    autoFilled.city = user.travel.city;
    autoFilled.resume = user.resume ? user.resume.url : '';
  
    if (!isSponsor) {
      autoFilled.whyEvent = user.whyEventResponse ? user.whyEventResponse : '';
      
      if (user.customQuestionResponses) {
        autoFilled = {...autoFilled, ...user.customQuestionResponses.toJSON()};
      }
  
      autoFilled.team = user.team ? user.team.code : '';
  
      autoFilled.qrCode = generateQRCodeURL(user);
    }
  }

  return autoFilled;
});

UserSchema.plugin(mongooseDelete);

// Defines the fields which are public to the account
export const PUBLIC_USER_FIELDS: string[] = Object.entries((UserSchema as any).paths)
  .filter(([fieldName, field]: any) => 'public' in field.options)
  .map(([fieldName, field]: any) => fieldName);
PUBLIC_USER_FIELDS.push('resume');

// Defines the fields which are editable by the account user
export const EDITABLE_USER_FIELDS: string[] = Object.entries((UserSchema as any).paths)
  .filter(([fieldName, field]: any) => 'editable' in field.options)
  .map(([fieldName, field]: any) => fieldName);
EDITABLE_USER_FIELDS.push('resume');

export const RegisterModel = () =>
  Container.set('UserModel', model<UserDocument, UserModel>('User', UserSchema));