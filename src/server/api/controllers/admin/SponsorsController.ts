import { Logger } from '@Config/Logging';
import AdminService from '@Services/AdminService';
import SponsorService from '@Services/SponsorService';
import { Role } from '@Shared/Roles';
import { GetSponsorsResponse, SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Post, Body } from 'routing-controllers';

import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { RoleAuth } from '../../middleware/RoleAuth';

@JsonController('/sponsors')
@UseBefore(AdminAuthorisation)
export class SponsorsController {
  constructor(
    private AdminService: AdminService,
    private SponsorService: SponsorService
  ) { }

  @Get('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async getSponsors(): Promise<GetSponsorsResponse> {
    const sponsors = await this.SponsorService.getAllSponsors();
    return sponsors.map(sponsor => ({
      _id: sponsor._id,
      username: sponsor.username,
    })) as GetSponsorsResponse;
  }
}
