import { AdminDocument } from '@Models/Admin';
import EventService from '@Services/EventService';
import { Admin } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import {
  AddCustomQuestionRequest, UpdateCustomQuestionRequest,
  DeleteCustomQuestionRequest
} from '@Shared/api/Requests';
import { SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Body, Post, Put, Delete } from 'routing-controllers';
import { ErrorMessage } from 'utils/Errors';

import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { RoleAuth } from '../../middleware/RoleAuth';

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
