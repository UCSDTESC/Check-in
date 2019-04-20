import { Role } from 'Shared/Roles';
import { Admin } from 'Shared/types';
import bcrypt from 'bcrypt-nodejs';
import mongoose, { HookNextFunction } from 'mongoose';
import mongooseSanitizer from 'mongoose-sanitizer';

const Schema = mongoose.Schema;

type AdminType = Admin & mongoose.Document & {
  comparePassword(password: string, cb: (err: Error, isMatch: boolean) => void): void;
};

const AdminSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, 'You must have a username'],
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'You must have a password'],
  },
  role: {
    type: String,
    enum: [Role.ROLE_ADMIN, Role.ROLE_DEVELOPER,
      Role.ROLE_SPONSOR, Role.ROLE_MEMBER],
    default: Role.ROLE_MEMBER,
  },
  // Admin solely defined to check-in users
  checkin: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  lastAccessed: {
    type: Date,
  },
}, {timestamps: true});

AdminSchema.pre<AdminType>('save', function(next: HookNextFunction) {
  // tslint:disable-next-line:no-invalid-this no-this-assignment
  const user = this;
  const SALT_FACTOR = process.env.SALT_ROUNDS;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null,
      (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
  });
});

AdminSchema.method('comparePassword', function(candidatePassword: string,
  cb: (err: Error, isMatch?: boolean) => void) {
  // tslint:disable-next-line:no-invalid-this
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, false);
    }

    cb(null, isMatch);
  });
});

AdminSchema.set('toJSON', {
  transform: (doc, ret) => {
    return {
      _id: ret._id,
      username: ret.username,
      role: ret.role,
      checkin: ret.checkin,
      createdAt: ret.createdAt,
      deleted: ret.deleted,
      deletedAt: ret.deletedAt,
      lastAccessed: ret.lastAccessed,
    };
  },
});

AdminSchema.plugin(mongooseSanitizer);

export const AdminModel = mongoose.model<AdminType>('Admin', AdminSchema);
