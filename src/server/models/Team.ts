import { TESCTeam } from '@Shared/ModelTypes';
import { Model, Schema, Document, model } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';
import { Container } from 'typedi';

export type TeamDocument = TESCTeam & Document;
export type TeamModel = Model<TeamDocument>;

export const TEAM_CODE_LENGTH = 4;

const TeamSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  code: {
    type: String,
    trim: true,
    unique: true,
    minlength: TEAM_CODE_LENGTH,
    maxlength: TEAM_CODE_LENGTH,
    required: [true, 'You must define a team code'],
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

TeamSchema.plugin(mongooseDelete);

export const RegisterModel = () =>
  Container.set('TeamModel', model<TeamDocument, TeamModel>('Team', TeamSchema));
