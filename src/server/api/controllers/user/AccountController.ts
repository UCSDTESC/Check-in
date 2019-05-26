import { EventDocument } from '@Models/Event';
import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { TESCEvent } from '@Shared/ModelTypes';
import { EmailExistsRequest } from '@Shared/api/Requests';
import { EventsWithStatisticsResponse, SuccessResponse, EmailExistsResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Param, QueryParam, Post, Body } from 'routing-controllers';

import { ErrorMessage } from '../../../utils/Errors';
import { SelectedEventAlias } from '../../decorators/SelectedEventAlias';
import { ValidateEventAlias } from '../../middleware/ValidateEventAlias';

/**
 * Handles all of the logic regarding a user account. Does not interact with
 * any of the individual event registrations.
 */
@JsonController('/account')
export class AccountController {
  constructor(
    private EventService: EventService,
    private UserService: UserService
  ) { }

  @Post('/:accountId/confirm')
  async confirmEmail(@Param('accountId') accountId: string) {
    const account = await this.UserService.confirmAccountEmail(accountId);
    if (!account) {
      throw new Error(ErrorMessage.NO_USER_EXISTS());
    }

    return SuccessResponse.Positive;
  }

  @Get('/:accountId/events')
  async getAccountEvents(@Param('accountId') accountId: string) {
    const account = await this.UserService.getAccountById(accountId);
    if (!account) {
      throw new Error(ErrorMessage.NO_USER_EXISTS());
    }

    return this.UserService.getAccountPublicEvents(account);
  }

  @Post('/exists')
  async checkEmailExists(@Body() body: EmailExistsRequest): Promise<EmailExistsResponse> {
    const account = await this.UserService.getAccountByEmail(body.email);
    return { exists: !!account };
  }
}
