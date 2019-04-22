import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { TESCUser } from '@Shared/Types';
import { CheckinUserRequest } from '@Shared/api/Requests';
import { SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Param, Post, Body } from 'routing-controllers';

import { AdminAuthorisation } from '../middleware/AdminAuthorisation';
import { IsOrganiser } from '../middleware/IsOrganiser';

@JsonController('/users')
@UseBefore(AdminAuthorisation)
export class UsersController {
  constructor(
    private UserService: UserService,
    private EventService: EventService
  ) {}

  @Get('/:eventAlias')
  @UseBefore(IsOrganiser)
  async get(@Param('eventAlias') eventAlias: string): Promise<TESCUser[]> {
    const event = await this.EventService.getEventByAlias(eventAlias);
    const users = await this.UserService.getAllUsersByEvent(event);

    return users;
  }

  @Post('/checkin/:eventAlias')
  @UseBefore(IsOrganiser)
  async checkinUser(@Body({required: true}) request: CheckinUserRequest): Promise<SuccessResponse> {
    return await this.UserService.checkinUserById(request.id)
      .then(() => SuccessResponse.Positive)
      .catch(() => SuccessResponse.Negative);
  }
}
