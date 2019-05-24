import { EventDocument } from '@Models/Event';
import AdminService from '@Services/AdminService';
import CSVService from '@Services/CSVService';
import EventService from '@Services/EventService';
import SponsorService from '@Services/SponsorService';
import UserService from '@Services/UserService';
import { Role } from '@Shared/Roles';
import {
  BulkChangeRequest,
  AddNewSponsorRequest,
  AddNewOrganiserRequest,
} from '@Shared/api/Requests';
import { SuccessResponse } from '@Shared/api/Responses';
import {
  Get, JsonController, UseBefore, Res, Post, Body, Put,
} from 'routing-controllers';

import { SelectedEventAlias } from '../decorators/SelectedEventAlias';
import { AdminAuthorisation } from '../middleware/AdminAuthorisation';
import { IsOrganiser } from '../middleware/IsOrganiser';
import { RoleAuth } from '../middleware/RoleAuth';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

@JsonController('/admin')
@UseBefore(AdminAuthorisation)
export class AdminController {
  constructor(
    private AdminService: AdminService,
    private EventService: EventService,
    private UserService: UserService,
  ) { }

  @Post('/bulkChange')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async bulkChangeUsers(@Body() body: BulkChangeRequest) {
    await this.UserService.changeUserStatuses(body.users, body.status);

    return SuccessResponse.Positive;
  }

  @Post('/addSponsor/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async addSponsorToEvent(@SelectedEventAlias() event: EventDocument, @Body() body: AddNewSponsorRequest) {
    const sponsor = await this.AdminService.getAdminById(body.sponsorId);
    await this.EventService.addSponsorToEvent(event, sponsor);

    return SuccessResponse.Positive;
  }

  @Post('/addOrganiser/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async addOrganiserToEvent(@SelectedEventAlias() event: EventDocument, @Body() body: AddNewOrganiserRequest) {
    const admin = await this.AdminService.getAdminById(body.organiserId);
    await this.EventService.addOrganiserToEvent(event, admin);

    return SuccessResponse.Positive;
  }
}
