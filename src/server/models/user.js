var mongoose = require('mongoose');
var crate = require('mongoose-crate');
var S3 = require('mongoose-crate-s3');
var mongooseDelete = require('mongoose-delete');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  // Declares the user's first name
  firstName: {
    type: String,
    trim: true,
    required: [true, 'You must have a first name'],
    displayName: 'First Name'
  },
  // Declares the user's last name
  lastName: {
    type: String,
    trim: true,
    required: [true, 'You must have a last name'],
    displayName: 'Last Name'
  },
  // Declares the user's birth date
  birthdate: {
    type: Date,
    required: [true, 'You must have a birthdate'],
    displayName: 'Birthdate'
  },
  // Declares the user's gender
  gender: {
    type: String,
    required: [true, 'You must have a gender'],
    displayName: 'Gender'
  },
  // Declares the user's phone number
  phone: {
    type: String,
    required: [true, 'You must have a phone number'],
    displayName: 'Phone'
  },
  // Declares which university the user attends
  university: {
    type: String,
    trim: true,
    displayName: 'University'
  },
  // Declares which high school the user attends
  highSchool: {
    type: String,
    trim: true,
    displayName: 'High School'
  },
  // Declares the UCSD student ID
  pid: {
    type: String,
    trim: true,
    displayName: 'PID'
  },
  // Declares which major the user has specified
  major: {
    type: String,
    trim: true,
    displayName: 'Major'
  },
  // Declares which year the student is currently attending
  year: {
    type: String,
    displayName: 'Year'
  },
  // Declares the user's Github account name
  github: {
    type: String,
    trim: true,
    required: false,
    displayName: 'Github'
  },
  // Declares the user's personal website link
  website: {
    type: String,
    trim: true,
    required: false,
    displayName: 'Website'
  },
  // Declares whether the user has given permission for their resume to be
  // shared
  shareResume: {
    type: Boolean,
    default: false,
    displayName: 'Share Resume'
  },
  // Declares the food that the user has requested
  food: {
    type: String,
    trim: true,
    displayName: 'Food'
  },
  // Declares what dietary requirements the user has
  diet: {
    type: String,
    trim: true,
    displayName: 'Diet'
  },
  // Declares the size of the shirt that the user has requested
  shirtSize: {
    type: String,
    displayName: 'Shirt Size'
  },
  travel: {
    // Declares whether the user will be travelling from outside of the state
    outOfState: {
      type: Boolean,
      default: false
    },
    // Declares which city the user will be travelling from
    city: {
      type: String
    }
  },
  // Declares the name of the bus that the user can take
  availableBus: {
    type: String,
    trim: true,
    displayName: 'Available Bus'
  },
  // Declares whether the user has noted they will be taking the bus
  bussing: {
    type: Boolean,
    default: false,
    displayName: 'Bussing'
  },
  // Declares the array of teammates that the user has defined
  teammates: [{
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'You must use a valid email'],
    displayName: 'Teammates'
  }],
  // Declares the user's current application status
  // Rejected, Unconfirmed, Confirmed, Declined, Late, and Waitlisted
  status: {
    type: String,
    trim: true,
    displayName: 'Status'
  },
  // Declares that the user has checked into the event on the day
  checkedIn: {
    type: Boolean,
    default: false,
    displayName: 'Checked In'
  },
  // Declares that the user's information is ready for sponsor consumption
  sanitized: {
    type: Boolean,
    default: false,
    displayName: 'Sanitized'
  },
  //Declares the user's provided race, required by events on an optional basis
  race: {
    type: String,
    required: false,
    displayName: 'Race'
  },
  // Declares whether or not the user has taken the class specified in the application
  classRequirement: {
    type: Boolean,
    default: false,
    displayName: 'Class Requirement'
  },
  // Declares the user's specified extra curriculars
  extraCurriculars: {
    type: String,
    trim: true,
    displayName: 'Extra Curriculars'
  },
  // Declares the user's GPA, required by events on an optional basis
  gpa: {
    type: String,
    required: false,
    displayName: 'GPA'
  },
  // Declares the user's major GPA, required by events on an optional basis
  majorGPA: {
    type: String,
    required: false,
    displayName: 'Major GPA'
  },
  // Declares the user's responses to the event's custom questions
  customQuestionResponses: {
    type: Map,
    of: 'String'
  },

  whyEventResponse: {
    type: String,
    required: false,
    displayName: 'Why This Event?'
  }
}, {timestamps: true});

UserSchema.plugin(require('mongoose-sanitizer'));

UserSchema.plugin(mongooseDelete);
UserSchema.plugin(crate, {
  storage: new S3({
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    region: 'us-west-1',
    path(attachment) {
      return `resumes/${attachment.name}`;
    }
  }),
  fields: {
    resume: {}
  }
});

UserSchema.methods.csvFlatten = function(cb) {
  const autoFill = ['_id', 'firstName', 'lastName', 'email', 'birthdate',
    'gender', 'phone', 'university', 'pid', 'major', 'year', 'github',
    'website', 'shareResume', 'food', 'diet', 'shirtSize', 'availableBus',
    'bussing', 'teammates', 'status', 'checkedIn'];

  var autoFilled = autoFill.reduce((acc, val) => {
    return Object.assign(acc, {[val]: this[val]});
  }, {});

  autoFilled.outOfState = this.travel.outOfState;
  autoFilled.city = this.travel.city;
  autoFilled.resume = this.resume ? this.resume.url : '';

  autoFilled.email = this.account ? this.account.email : '';

  return autoFilled;
};

mongoose.model('User', UserSchema);
