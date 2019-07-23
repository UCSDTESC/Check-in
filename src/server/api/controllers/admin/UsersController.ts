import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { TESCUser, Admin } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import { BulkChangeRequest } from '@Shared/api/Requests';
import { SuccessResponse } from '@Shared/api/Responses';
import { JsonController, UseBefore, Post, Body, Patch } from 'routing-controllers';

import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { RoleAuth } from '../../middleware/RoleAuth';

/**
 * Handles all of the logic for updating user information.
 */
@JsonController('/users')
@UseBefore(AdminAuthorisation)
export class UsersController {
  constructor(
    private UserService: UserService,
    private EventService: EventService
  ) { }

  @Post('/')
  async updateUser(@AuthorisedAdmin() admin: Admin, @Body() body: TESCUser) {
    await this.EventService.isAdminOrganiser(body.event.alias, admin);
    await this.UserService.updateUser(body);
    return SuccessResponse.Positive;
  }

  @Patch('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async bulkUpdate(@Body() body: BulkChangeRequest) {
    await this.UserService.changeUserStatuses(body.users, body.status);

    return SuccessResponse.Positive;
  }
}
