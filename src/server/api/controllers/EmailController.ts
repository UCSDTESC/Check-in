import { AuthorisedAdmin } from '../decorators/AuthorisedAdmin';
import { SelectedEvent } from '../decorators/SelectedEvent';
import {AdminAuthorisation} from '../middleware/AdminAuthorisation';
import { RoleAuth } from '../middleware/RoleAuth';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';
import { Logger } from '@Config/Logging';
import EmailService from '@Services/EmailService';
import { Role } from '@Shared/Roles';
import { AcceptanceEmailRequest } from '@Shared/api/Requests'
import { EventDocument } from '@Models/Event';
import { Post, JsonController, UseBefore, Req, Body } from 'routing-controllers';
import { Request } from 'express';
import { Admin } from '@Shared/ModelTypes';
import { SuccessResponse } from '@Shared/api/Responses';

@JsonController('/email')
@UseBefore(AdminAuthorisation)
export class EmailController {
  constructor(
    private EmailService: EmailService
  ) {}

  @Post('/acceptance/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(ValidateEventAlias)
  async sendAcceptanceEmail(
    @AuthorisedAdmin() admin: Admin,
    @Req() request: Request,
    @SelectedEvent() event: EventDocument,
    @Body() body: AcceptanceEmailRequest
  ): Promise<SuccessResponse> {
    const sendGridResponse = await this.EmailService.sendEventAcceptanceEmail(request, admin, event, body.userEmail);
    const {statusCode, statusMessage} = sendGridResponse[0];

    if (statusCode >= 400) {
      Logger.error(`Sendgrid Send API Call Failed - returned statusCode ${statusCode} and statusMessage ${statusMessage}`);
      return SuccessResponse.Negative;
    }
    return SuccessResponse.Positive
  }
}