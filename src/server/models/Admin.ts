import { Config } from '@Config/index';
import { Admin } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import * as bcrypt from 'bcrypt-nodejs';
import { HookNextFunction, Model, Schema, Document, model } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';
import * as mongooseSanitizer from 'mongoose-sanitizer';
import { Container } from 'typedi';

export type AdminDocument = Admin & Document & {
  comparePassword(password: string, cb: (err: Error, isMatch: boolean) => void): void;
};

export type AdminModel = Model<AdminDocument>;

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

AdminSchema.pre<AdminDocument>('save', function(next: HookNextFunction) {
  // tslint:disable-next-line:no-invalid-this no-this-assignment
  const user = this;
  const SALT_FACTOR = Config.SaltRounds;

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
AdminSchema.plugin(mongooseDelete);

export const RegisterModel = () =>
  Container.set('AdminModel', model<AdminDocument, AdminModel>('Admin', AdminSchema));
