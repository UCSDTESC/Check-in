var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var mongooseDelete = require('mongoose-delete');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  // Declares the user's email address
  email: {
    type: String,
    required: [true, 'You must have an email'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'You must use a valid email']
  },
  // Declares the user's login password
  password: {
    type: String,
    trim: true,
    required: [true, 'You must have a password']
  },
  // Declares the user has confirmed their email address
  confirmed: {
    type: Boolean,
    default: false
  }
});

AccountSchema.pre('save', function(next) {
  const user = this;
  const SALT_FACTOR = process.env.SALT_ROUNDS;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null,
      function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
  });
});

AccountSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

AccountSchema.plugin(require('mongoose-sanitizer'));

AccountSchema.plugin(timestamps);
AccountSchema.plugin(mongooseDelete);

mongoose.model('Account', AccountSchema);
