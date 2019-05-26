import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { TESCUser, Admin } from '@Shared/ModelTypes';
import { SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Post, Body } from 'routing-controllers';

import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';

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
}
