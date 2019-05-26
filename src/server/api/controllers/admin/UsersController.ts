import { EventDocument } from '@Models/Event';
import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { TESCUser, Admin } from '@Shared/ModelTypes';
import { CheckinUserRequest } from '@Shared/api/Requests';
import { SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Post, Body } from 'routing-controllers';

import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { SelectedEventAlias } from '../../decorators/SelectedEventAlias';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { IsOrganiser } from '../../middleware/IsOrganiser';
import { ValidateEventID } from 'api/middleware/ValidateEventID';
import { SelectedEventID } from 'api/decorators/SelectedEventID';

@JsonController('/users')
@UseBefore(AdminAuthorisation)
export class UsersController {
  constructor(
    private UserService: UserService,
    private EventService: EventService
  ) { }

  @Post('/checkin/:eventAlias')
  @UseBefore(IsOrganiser)
  async checkinUser(@Body() request: CheckinUserRequest): Promise<SuccessResponse> {
    await this.UserService.checkinUserById(request.id);
    return SuccessResponse.Positive;
  }

  @Post('/')
  async updateUser(@AuthorisedAdmin() admin: Admin,
    @SelectedEventAlias() event: EventDocument, @Body() body: TESCUser) {
    await this.EventService.isAdminOrganiser(event.alias, admin);
    await this.UserService.updateUser(body);
    return SuccessResponse.Positive;
  }
}
