import { EventDocument } from '@Models/Event';
import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { TESCUser } from '@Shared/ModelTypes';
import { CheckinUserRequest } from '@Shared/api/Requests';
import { SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Post, Body } from 'routing-controllers';

import { SelectedEventAlias } from '../decorators/SelectedEventAlias';
import { AdminAuthorisation } from '../middleware/AdminAuthorisation';
import { IsOrganiser } from '../middleware/IsOrganiser';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

@JsonController('/users')
@UseBefore(AdminAuthorisation)
export class UsersController {
  constructor(
    private UserService: UserService,
    private EventService: EventService
  ) { }

  @Get('/:eventAlias')
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async get(@SelectedEventAlias() event: EventDocument): Promise<TESCUser[]> {
    const users = await this.UserService.getAllUsersByEvent(event);

    return users;
  }

  @Post('/checkin/:eventAlias')
  @UseBefore(IsOrganiser)
  async checkinUser(@Body() request: CheckinUserRequest): Promise<SuccessResponse> {
    await this.UserService.checkinUserById(request.id);
    return SuccessResponse.Positive;
  }

  @Post('/:eventAlias')
  @UseBefore(IsOrganiser)
  async updateUser(@Body() body: TESCUser) {
    await this.UserService.updateUser(body);
    return SuccessResponse.Positive;
  }
}
