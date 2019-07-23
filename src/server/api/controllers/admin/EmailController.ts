import { Logger } from '@Config/Logging';
import EmailService from '@Services/EmailService';
import EventService from '@Services/EventService';
import { Admin, TESCUser } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import { SuccessResponse } from '@Shared/api/Responses';
import { Request } from 'express';
import { Post, JsonController, UseBefore, Req, BodyParam } from 'routing-controllers';
import { ErrorMessage } from 'utils/Errors';

import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { RoleAuth } from '../../middleware/RoleAuth';

@JsonController('/emails')
@UseBefore(AdminAuthorisation)
export class EmailController {
  constructor(
    private EmailService: EmailService,
    private EventService: EventService
  ) { }

  @Post('/acceptance/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async sendAcceptanceEmail(
    @AuthorisedAdmin() admin: Admin,
    @Req() request: Request,
    @BodyParam('user') forUser: TESCUser
  ): Promise<SuccessResponse> {
    const isOrganiser = await this.EventService.isAdminOrganiser(forUser.event.alias, admin);

    if (!isOrganiser) {
      Logger.error(ErrorMessage.NOT_ORGANISER());
      return SuccessResponse.Negative;
    }

    const sendGridResponse = await this.EmailService.sendEventAcceptanceEmail(request, admin, forUser.event, forUser);
    const { statusCode, statusMessage } = sendGridResponse[0];

    if (statusCode >= 400) {
      Logger.error(`Sendgrid Send API Call Failed - returned statusCode '${
        statusCode}' and statusMessage '${statusMessage}'`);
      return SuccessResponse.Negative;
    }
    return SuccessResponse.Positive;
  }

  @Post('/rejection/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async sendRejectionEmail(
    @AuthorisedAdmin() admin: Admin,
    @Req() request: Request,
    @BodyParam('user') forUser: TESCUser
  ): Promise<SuccessResponse> {
    const isOrganiser = await this.EventService.isAdminOrganiser(forUser.event.alias, admin);

    if (!isOrganiser) {
      Logger.error(ErrorMessage.NOT_ORGANISER());
      return SuccessResponse.Negative;
    }

    const sendGridResponse = await this.EmailService.sendEventRejectionEmail(request, admin, forUser.event, forUser);
    const { statusCode, statusMessage } = sendGridResponse[0];

    if (statusCode >= 400) {
      Logger.error(`Sendgrid Send API Call Failed - returned statusCode '${
        statusCode}' and statusMessage '${statusMessage}'`);
      return SuccessResponse.Negative;
    }
    return SuccessResponse.Positive;
  }

  @Post('/waitlist/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async sendWaitlistEmail(
    @AuthorisedAdmin() admin: Admin,
    @Req() request: Request,
    @BodyParam('user') forUser: TESCUser
  ): Promise<SuccessResponse> {
    const isOrganiser = await this.EventService.isAdminOrganiser(forUser.event.alias, admin);

    if (!isOrganiser) {
      Logger.error(ErrorMessage.NOT_ORGANISER());
      return SuccessResponse.Negative;
    }

    const sendGridResponse = await this.EmailService.sendEventWaitlistEmail(request, admin, forUser.event, forUser);
    const { statusCode, statusMessage } = sendGridResponse[0];

    if (statusCode >= 400) {
      Logger.error(`Sendgrid Send API Call Failed - returned statusCode '${
        statusCode}' and statusMessage '${statusMessage}'`);
      return SuccessResponse.Negative;
    }
    return SuccessResponse.Positive;
  }
}
