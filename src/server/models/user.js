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
    required: [true, 'You must have a first name']
  },
  // Declares the user's last name
  lastName: {
    type: String,
    trim: true,
    required: [true, 'You must have a last name']
  },
  // Declares the user's birth date
  birthdate: {
    type: Date,
    required: [true, 'You must have a birthdate']
  },
  // Declares the user's gender
  gender: {
    type: String,
    required: [true, 'You must have a gender']
  },
  // Declares the user's phone number
  phone: {
    type: String,
    required: [true, 'You must have a phone number']
  },
  // Declares which university the user attends
  university: {
    type: String,
    trim: true,
    required: [true, 'You must have a University / High School']
  },
  // Declares the UCSD student ID
  pid: {
    type: String,
    trim: true
  },
  // Declares which major the user has specified
  major: {
    type: String,
    trim: true
  },
  // Declares which year the student is currently attending
  year: {
    type: String,
  },
  // Declares the user's Github account name
  github: {
    type: String,
    trim: true,
    required: false,
  },
  // Declares the user's personal website link
  website: {
    type: String,
    trim: true,
    required: false,
  },
  // Declares whether the user has given permission for their resume to be
  // shared
  shareResume: {
    type: Boolean,
    default: false
  },
  // Declares the food that the user has requested
  food: {
    type: String,
    trim: true,
  },
  // Declares what dietary requirements the user has
  diet: {
    type: String,
    trim: true,
  },
  // Declares the size of the shirt that the user has requested
  shirtSize: {
    type: String,
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
    trim: true
  },
  // Declares whether the user has noted they will be taking the bus
  bussing: {
    type: Boolean,
    default: false
  },
  // Declares the array of teammates that the user has defined
  teammates: [{
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'You must use a valid email']
  }],
  // Declares the user's current application status
  // Rejected, Unconfirmed, Confirmed, Declined, Late, and Waitlisted
  status: {
    type: String,
    trim: true
  },
  // Declares that the user has checked into the event on the day
  checkedIn: {
    type: Boolean,
    default: false
  },
  // Declares that the user's information is ready for sponsor consumption
  sanitized: {
    type: Boolean,
    default: false
  },
  race: {
    type: String,
    required: false
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
