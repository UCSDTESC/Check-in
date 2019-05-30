import { AccountPasswordReset } from '@Shared/ModelTypes';
import { Model, Schema, model, Document } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';
import { Container } from 'typedi';

export type AccountResetDocument = AccountPasswordReset & Document;
export type AccountResetModel = Model<AccountResetDocument>;

const AccountResetSchema = new Schema({
  // Declares the account that will be reset
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
  },
  // Declares the URL string which references this reset
  resetString: {
    type: String,
    unique: true,
  },
  // Declares until when this reset is active
  expires: {
    type: Date,
  },
  // Declares whether the reset is still allowed (hasn't been used)
  valid: {
    type: Boolean,
    default: true,
  },
}, {timestamps: true});

AccountResetSchema.plugin(mongooseDelete);

export const RegisterModel = () =>
  Container.set('AccountResetModel', model<AccountResetDocument,
    AccountResetModel>('AccountReset', AccountResetSchema));
