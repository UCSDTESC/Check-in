import ResumeService from '@Services/ResumeService';
import { TESCUser, UserStatus } from '@Shared/ModelTypes';
import { Model, Schema, Document, model } from 'mongoose';
import crate from 'mongoose-crate';
import S3 from 'mongoose-crate-s3';
import mongooseDelete from 'mongoose-delete';
import mongooseSanitizer from 'mongoose-sanitizer';
import { Container } from 'typedi';

export type UserDocument = TESCUser & Document & {
  csvFlatten: () => any;
  attach: (name: string, options: any) => Promise<UserDocument>;
};
export type UserModel = Model<UserDocument>;

/**
 * @swagger
 * components:
 *   schemas:
 *     UserStatus:
 *       type: string
 *       enum: [Rejected, Unconfirmed, Confirmed, Declined, Late, Waitlisted]
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         account:
 *           $ref: '#/components/schemas/Account'
 *           required: true
 *         event:
 *           $ref: '#/components/schemas/Event'
 *           required: true
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         birthdate:
 *           type: string
 *           format: date-time
 *         gender:
 *           type: string
 *         phone:
 *           type: string
 *         university:
 *           type: string
 *         highSchool:
 *           type: string
 *         pid:
 *           type: string
 *           description: A student ID.
 *         major:
 *           type: string
 *         year:
 *           type: string
 *           description: The year the student is currently attending.
 *         github:
 *           type: string
 *         website:
 *           type: string
 *         shareResume:
 *           type: boolean
 *           description: Indicates whether the student has given sponsors access to their resume.
 *         food:
 *           type: string
 *           description: Food options that the student says they prefer.
 *         diet:
 *           type: string
 *           description: The dietary requirements of the student.
 *         shirtSize:
 *           type: string
 *         travel:
 *           type: object
 *           properties:
 *             outOfState:
 *               type: boolean
 *             city:
 *               type: string
 *         availableBus:
 *           type: string
 *           description: The name of the bus the student has available to them.
 *         bussing:
 *           type: boolean
 *           description: Indicates whether the student has chosen to take the bus option.
 *         teammates:
 *           type: array
 *           description: The emails of teammates the student has indicated.
 *           items:
 *             type: string
 *             format: email
 *           minItems: 0
 *           maxItems: 4
 *           uniqueItems: true
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
 *         checkedIn:
 *           type: boolean
 *         sanitized:
 *           type: booelan
 *           description: Indicates whether the student information is ready for sponsors.
 *         race:
 *           type: string
 *           description: Required by certains events hosted by MLH.
 *         extraCurriculars:
 *           type: string
 *           description: A list of the student's extra curricular activities.
 *         gpa:
 *           type: string
 *         majorGPA:
 *           type: string
 *           description: The name of the bus the student has available to them.
 *         whyEventResponse:
 *           type: string
 *           description: The response to the 'Why {eventName}?' question.
 *         customQuestionResponses:
 *           type: object
 *           description: A mapping of the custom question ID property to the student's responses.
 *           additionProperties:
 *             type: string
 */

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
  // Declares the array of teammates that the user has defined
  teammates: [{
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'You must use a valid email'],
    displayName: 'Teammates',
    public: true,
    editable: true,
  }],
  // Declares the user's current application status
  // Rejected, Unconfirmed, Confirmed, Declined, Late, and Waitlisted
  status: {
    type: String,
    trim: true,
    displayName: 'Status',
    public: true,
    enum: Object.values(UserStatus),
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

UserSchema.method('csvFlatten', function () {
  // tslint:disable-next-line:no-invalid-this no-this-assignment
  const user = this;
  const autoFill = ['_id', 'firstName', 'lastName', 'email', 'birthdate',
    'gender', 'phone', 'university', 'pid', 'major', 'year', 'github',
    'website', 'shareResume', 'food', 'diet', 'shirtSize', 'availableBus',
    'bussing', 'teammates', 'status', 'checkedIn'];

  const autoFilled: any = autoFill.reduce((acc, val) => {
    return Object.assign(acc, { [val]: user[val] });
  }, {});

  autoFilled.outOfState = user.travel.outOfState;
  autoFilled.city = user.travel.city;
  autoFilled.resume = user.resume ? user.resume.url : '';

  autoFilled.email = user.account ? user.account.email : '';

  return autoFilled;
});

UserSchema.plugin(mongooseDelete);

// Defines the fields which are public to the account
export const PUBLIC_USER_FIELDS: string[] = Object.entries((UserSchema as any).paths)
  .filter(([fieldName, field]: any) => 'public' in field.options)
  .map(([fieldName, field]: any) => fieldName);
PUBLIC_USER_FIELDS.push('teammates');
PUBLIC_USER_FIELDS.push('resume');

// Defines the fields which are editable by the account user
export const EDITABLE_USER_FIELDS: string[] = Object.entries((UserSchema as any).paths)
  .filter(([fieldName, field]: any) => 'editable' in field.options)
  .map(([fieldName, field]: any) => fieldName);
EDITABLE_USER_FIELDS.push('teammates');
EDITABLE_USER_FIELDS.push('resume');

export const RegisterModel = () =>
  Container.set('UserModel', model<UserDocument, UserModel>('User', UserSchema));
