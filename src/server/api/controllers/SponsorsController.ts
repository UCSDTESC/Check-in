import { EventDocument } from '@Models/Event';
import SponsorService from '@Services/SponsorService';
import UserService from '@Services/UserService';
import { Download, Admin, TESCEvent } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import { DownloadResumesRequest } from '@Shared/api/Requests';
import { Response } from 'express';
import { Get, JsonController, UseBefore, Post, Body, Res, Param } from 'routing-controllers';

import { ErrorMessage } from '../../utils/Errors';
import { AuthorisedAdmin } from '../decorators/AuthorisedAdmin';
import { SelectedEvent } from '../decorators/SelectedEvent';
import { AdminAuthorisation } from '../middleware/AdminAuthorisation';
import { IsSponsor } from '../middleware/IsSponsor';
import { RoleAuth } from '../middleware/RoleAuth';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

@JsonController('/sponsors')
@UseBefore(AdminAuthorisation)
export class SponsorsController {
  constructor(
    private SponsorService: SponsorService,
    private UserService: UserService,
  ) {}

  @Get('/applicants/:eventAlias')
  @UseBefore(IsSponsor)
  @UseBefore(ValidateEventAlias)
  async getEventApplicants(@SelectedEvent() event: EventDocument, @AuthorisedAdmin() sponsor: Admin) {
    return await this.UserService.getSponsorApplicantsByEvent(event);
  }

  @Post('/download')
  @UseBefore(RoleAuth(Role.ROLE_SPONSOR))
  async downloadResumes(@AuthorisedAdmin() admin: Admin, @Body() body: DownloadResumesRequest): Promise<Download> {
    const userIDs = body.applicants;
    const users = await this.SponsorService.getSelectedUsers(userIDs);

    if (users.length === 0) {
      throw new Error(ErrorMessage.NO_USERS_SELECTED());
    }

    const download = await this.SponsorService.createResumeDownload(users, admin);
    return new Promise(async (resolve, reject) => {
      resolve(download);

      await this.SponsorService.startResumeDownlod(download, users, admin);
    });
  }

  @Get('/download/:id')
  @UseBefore(RoleAuth(Role.ROLE_SPONSOR))
  async pollDownload(@Param('id') downloadId: string) {
    const download = await this.SponsorService.findDownloadById(downloadId);
    if (!download || download.error) {
      throw new Error(ErrorMessage.RESUME_ZIPPING_ERROR());
    }

    return download;
  }
}
