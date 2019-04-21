import SponsorService from '@Services/SponsorService';
import { Role } from '@Shared/Roles';
import { GetSponsorsResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore } from 'routing-controllers';

import { RoleAuth } from '../middleware/RoleAuth';

@JsonController('/admin')
export class AdminController {
  constructor(
    private SponsorService: SponsorService
  ) {}

  @Get('/sponsors')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async getSponsors(): Promise<GetSponsorsResponse> {
    const sponsors = await this.SponsorService.getAllSponsors();
    return sponsors.map(sponsor => ({
      _id: sponsor._id,
      username: sponsor.username,
    })) as GetSponsorsResponse;
  }
}
