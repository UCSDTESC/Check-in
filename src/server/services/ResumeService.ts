import { Config } from '@Config/index';
import { DownloadModel } from '@Models/Download';
import { UserDocument } from '@Models/User';
import { Response } from 'express';
import { Parser } from 'json2csv';
import moment = require('moment');
import * as generatePassword from 'password-generator';
import * as S3Archiver from 's3-archiver';
import { Service, Inject } from 'typedi';

import CSVService from './CSVService';

@Service()
export default class ResumeService {
  static folder = 'resumes';
  static filePrefix = `${ResumeService.folder}/`;
  static outputFilePrefix = `downloads/`;

  constructor(
    private CSVService: CSVService
  ) {}

  /**
   * Creates a new zipper based on the local config.
   */
  createZipper() {
    return new S3Archiver({
      accessKeyId: Config.S3.Key,
      secretAccessKey: Config.S3.Secret,
      region: 'us-west-1',
      bucket: Config.S3.Bucket,
    }, {
      folder: ResumeService.folder,
      filePrefix: ResumeService.filePrefix,
    });
  }

  /**
   * Zips the resumes and a CSV of user information to a file in the S3 bucket.
   * @param users The users whose resumes and information will be zipped.
   * @param outputFileName The name of the file that will be saved to the bucket.
   */
  async startZip(users: UserDocument[], outputFileName?: string) {
    return new Promise((resolve, reject) => {
      const zipper = this.createZipper();

      const usersWithResumes = users.filter(user => (user.resume != null) && (user.resume.name != null));
      const S3FileNames = usersWithResumes.map(file => `${ResumeService.filePrefix}${file.resume.name}`);

      if (!outputFileName) {
        outputFileName = `${moment().format('YYYYMMDDHHmmss')}-${generatePassword(12, false, /[\dA-F]/)}.zip`;
      }

      zipper.localConfig.finalizing = (archive, finalizing) =>
        this.CSVService.writeUserResumeData(users, archive, finalizing);

      zipper.zipFiles(S3FileNames, `${ResumeService.outputFilePrefix}${outputFileName}`, {
        ACL: 'public-read',
      }, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }
}
