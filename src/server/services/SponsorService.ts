import { Logger } from '@Config/Logging';
import { DownloadModel, DownloadDocument } from '@Models/Download';
import { EventDocument } from '@Models/Event';
import { UserModel, UserDocument } from '@Models/User';
import { AdminModel } from '@Models/Admin';
import { Admin, Download } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import moment = require('moment');
import * as generatePassword from 'password-generator';
import { Service, Inject } from 'typedi';

import ResumeService from './ResumeService';

@Service()
export default class SponsorService {
  @Inject('AdminModel')
  private AdminModel: AdminModel;

  @Inject('UserModel')
  private UserModel: UserModel;

  @Inject('DownloadModel')
  private DownloadModel: DownloadModel;

  constructor(
    private ResumeService: ResumeService
  ) {}

  /**
   * Get a list of all sponsors.
   */
  async getAllSponsors() {
    return await this.AdminModel.find({role: Role.ROLE_SPONSOR}).exec();
  }

  /**
   * Fetches the users associated with a list of user IDs, and their account information.
   * @param userIDs The list of user IDs to fetch.
   */
  async getSelectedUsers(userIDs: string[]) {
    return await this.UserModel
      .find({_id: {$in: userIDs}})
      .populate('account')
      .exec();
  }

  /**
   * Create a new download document for the associated users.
   * @param users The users for which to create the download.
   * @param requester The admin requesting the download.
   */
  async createResumeDownload(users: UserDocument[], requester: Admin) {
    const download = new this.DownloadModel({
      fileCount: users.length,
      admin: requester,
    } as Download);

    await download.save();

    return download;
  }

  /**
   * Starts the process of downloading resumes and zip files, and updates the download object associated with it.
   * @param download The download document associated with the list of users.
   * @param users The users associated with the download.
   * @param requester The admin requesting the ZIP file.
   */
  async startResumeDownlod(download: DownloadDocument, users: UserDocument[], requester: Admin) {
    Logger.info(`Started zipping [${download._id}] ${users.length} users for ${requester.username}`);

    try {
      const outputFileName =
        `${requester.username}-${moment().format('YYYYMMDDHHmmss')}-${generatePassword(12, false, /[\dA-F]/)}.zip`;
      const s3ZippedFile: any = await this.ResumeService.startZip(users, outputFileName);

      download.accessUrl = s3ZippedFile.Location;
      Logger.info(`Zipping [${download._id}] finished successfully`);
    } catch (err) {
      Logger.error(`Zipping [${download._id}] encountered an error`);
      Logger.error(err);
      download.error = true;
    }

    download.fulfilled = true;
    await download.save();
  }

  /**
   * Gets a download by a given ID.
   * @param downloadId The ID of the download to fetch.
   */
  async findDownloadById(downloadId: string) {
    return this.DownloadModel
      .findById(downloadId)
      .exec();
  }

  /**
   * Get all the applicants, with populated sponsor fields, for a given event.
   * @param event The event for which to get all applicants.
   */
  async getSponsorApplicantsByEvent(event: EventDocument) {
    return this.UserModel
      .find({
        'deleted': {$ne: true},
        'shareResume': true,
        'resume': {$exists: true},
        'resume.size': {$gt: 0},
        'sanitized': true,
        'event': event,
      })
      .select('firstName lastName university year gender major' +
      ' resume.url status account')
      .populate('account')
      .exec();
  }
}
