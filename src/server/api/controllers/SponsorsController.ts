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
import { SelectedEventAlias } from '../decorators/SelectedEventAlias';
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
  ) { }

  @Get('/applicants/:eventAlias')
  @UseBefore(IsSponsor)
  @UseBefore(ValidateEventAlias)
  async getEventApplicants(@SelectedEventAlias() event: EventDocument, @AuthorisedAdmin() sponsor: Admin) {
    return await this.SponsorService.getSponsorApplicantsByEvent(event);
  }
}
