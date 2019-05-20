import { Download } from '@Shared/ModelTypes';
import { Model, Schema, model, Document } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import { Container } from 'typedi';

export type DownloadDocument = Download & Document;
export type DownloadModel = Model<DownloadDocument>;

/**
 * @swagger
 * components:
 *   schemas:
 *     Download:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         fileCount:
 *           type: integer
 *           required: true
 *           description: The number of files included in the download.
 *         admin:
 *           $ref: '#/components/schemas/Admin'
 *           required: true
 *         accessUrl:
 *           type: string
 *           description: The public URL where the download can be accessed.
 *           format: uri
 *         error:
 *           type: boolean
 *           description: Indicates whether there was an error during the download process.
 *         fulfilled:
 *           type: boolean
 *           description: Indicates whether the download has been fulfilled.
 */

const DownloadSchema = new Schema({
  // Declares how many files were included in the download
  fileCount: {
    type: Number,
    required: [true, 'You must specify how many files are being downloaded'],
  },
  // Declares which administrator called for the download
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  // The URL where the download can be accessed
  accessUrl: {
    type: String,
  },
  // Declares whether an error occurred with the download
  error: {
    type: Boolean,
    default: false,
  },
  // Declares whether the download has been fulfilled
  fulfilled: {
    type: Boolean,
    default: false,
    required: [true, 'You must specify whether the download has been fulfilled'],
  },
}, { timestamps: true });

DownloadSchema.plugin(mongooseDelete);

export const RegisterModel = () =>
  Container.set('DownloadModel', model<DownloadDocument, DownloadModel>('Download', DownloadSchema));
