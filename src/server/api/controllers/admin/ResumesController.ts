import { Logger } from '@Config/Logging';
import AdminService from '@Services/AdminService';
import SponsorService from '@Services/SponsorService';
import { Admin, Download } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import { DownloadResumesRequest } from '@Shared/api/Requests';
import { GetSponsorsResponse, SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Post, Body, Param } from 'routing-controllers';
import { ErrorMessage } from 'utils/Errors';

import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { RoleAuth } from '../../middleware/RoleAuth';

@JsonController('/resumes')
@UseBefore(AdminAuthorisation)
export class ResumesController {
  constructor(
    private SponsorService: SponsorService
  ) { }

  @Post('/')
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

  @Get('/:downloadId')
  @UseBefore(RoleAuth(Role.ROLE_SPONSOR))
  async pollDownload(@Param('downloadId') downloadId: string) {
    const download = await this.SponsorService.findDownloadById(downloadId);
    if (!download || download.error) {
      throw new Error(ErrorMessage.RESUME_ZIPPING_ERROR());
    }

    return download;
  }
}
