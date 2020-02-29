import CSVService from '@Services/CSVService';
import SponsorService from '@Services/SponsorService';
import { Admin, Download } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import { DownloadResumesRequest } from '@Shared/api/Requests';
import { Response } from 'express-serve-static-core';
import moment = require('moment');
import { Get, Res, JsonController, UseBefore, Post, Body, Param } from 'routing-controllers';
import { ErrorMessage } from 'utils/Errors';

import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { RoleAuth } from '../../middleware/RoleAuth';

/**
 * Handles all of the logic for downloading user resumes.
 */
@JsonController('/resumes')
@UseBefore(AdminAuthorisation)
export class ResumesController {
  constructor(
    private CSVService: CSVService,
    private SponsorService: SponsorService
  ) { }

  @Post('/')
  @UseBefore(RoleAuth(Role.ROLE_SPONSOR))
  async downloadResumes(@AuthorisedAdmin() admin: Admin, 
    @Body() body: DownloadResumesRequest, @Res() response: Response) {
    const userIDs = body.applicants;
    const users = await this.SponsorService.getSelectedUsers(userIDs);

    if (users.length === 0) {
      throw new Error(ErrorMessage.NO_USERS_SELECTED());
    }

    const flattenedUsers = users.map(user => user.csvFlatten(true));
    const fileName = `${admin.username}-${moment().format()}.csv`;
    const csv = this.CSVService.parseJSONToCSV(flattenedUsers);
    response = this.CSVService.setJSONReturnHeaders(response, fileName);
    return response.send(csv);
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
