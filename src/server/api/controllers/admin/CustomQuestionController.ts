import UserService from '@Services/UserService';
import { Get, JsonController, UseBefore, Body, Post, Res, BadRequestError, Put, Delete } from 'routing-controllers';

import EventService from '@Services/EventService';
import CSVService from '@Services/CSVService';
import { RoleAuth } from '../../middleware/RoleAuth';
import { Role } from '@Shared/Roles';
import { IsOrganiser } from '../../middleware/IsOrganiser';
import { ValidateEventAlias } from '../../middleware/ValidateEventAlias';
import { SelectedEventAlias } from '../../decorators/SelectedEventAlias';
import { EventDocument } from '@Models/Event';
import { AddCustomQuestionRequest, UpdateCustomQuestionRequest, DeleteCustomQuestionRequest } from '@Shared/api/Requests';
import { SuccessResponse } from '@Shared/api/Responses';
import { ErrorMessage } from 'utils/Errors';
import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { AdminDocument } from '@Models/Admin';
import { Admin } from '@Shared/ModelTypes';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';

@JsonController('/customQuestion')
@UseBefore(AdminAuthorisation)
export class CustomQuestionController {
  constructor(
    private EventService: EventService
  ) { }

  /**
   * Enforces that the given admin is an organiser for the given event (by alias).
   */
  verifyEventOrganiser = async (alias: string, admin: Admin) => {
    const isOrganiser = await this.EventService.isAdminOrganiser(alias, admin);
    if (!isOrganiser) {
      throw new Error(ErrorMessage.NOT_ORGANISER());
    }
  };

  @Post('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async addCustomQuestion(@AuthorisedAdmin() admin: AdminDocument, @Body() body: AddCustomQuestionRequest) {
    await this.verifyEventOrganiser(body.alias, admin);
    const event = await this.EventService.getEventByAlias(body.alias);
    const newQuestion = await this.EventService.createQuestion(body.question);
    await this.EventService.addQuestionToEvent(event, newQuestion, body.type);

    return SuccessResponse.Positive;
  }

  @Put('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async updateCustomQuestion(@AuthorisedAdmin() admin: AdminDocument, @Body() body: UpdateCustomQuestionRequest) {
    await this.verifyEventOrganiser(body.alias, admin);
    await this.EventService.updateQuestion(body.question);

    return SuccessResponse.Positive;
  }

  @Delete('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async deleteCustomQuestion(@AuthorisedAdmin() admin: AdminDocument, @Body() body: DeleteCustomQuestionRequest) {
    await this.verifyEventOrganiser(body.alias, admin);
    const event = await this.EventService.getEventByAlias(body.alias);
    await this.EventService.removeQuestionFromEvent(event, body.question, body.type);
    await this.EventService.deleteQuestion(body.question);

    return SuccessResponse.Positive;
  }
}
