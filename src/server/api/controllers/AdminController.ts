import Uploads from '@Config/Uploads';
import { AdminDocument } from '@Models/Admin';
import { EventDocument } from '@Models/Event';
import AdminService from '@Services/AdminService';
import CSVService from '@Services/CSVService';
import EventService from '@Services/EventService';
import SponsorService from '@Services/SponsorService';
import UserService from '@Services/UserService';
import { Admin, TESCEvent } from '@Shared/ModelTypes';
import { Role, hasRankEqual, hasRankAtLeast } from '@Shared/Roles';
import {
  AddCustomQuestionRequest, UpdateCustomQuestionRequest,
  DeleteCustomQuestionRequest,
  BulkChangeRequest,
  UpdateEventOptionsRequest,
  AddNewSponsorRequest,
  AddNewOrganiserRequest,
  RegisterEventRequest
} from '@Shared/api/Requests';
import { GetSponsorsResponse, EventsWithStatisticsResponse, SuccessResponse } from '@Shared/api/Responses';
import { Response } from 'express';
import * as moment from 'moment';
import {
  Get, JsonController, UseBefore, Res, Post, Body, Put,
  Delete, UploadedFile, BodyParam
} from 'routing-controllers';

import { AuthorisedAdmin } from '../decorators/AuthorisedAdmin';
import { SelectedEventAlias } from '../decorators/SelectedEventAlias';
import { AdminAuthorisation } from '../middleware/AdminAuthorisation';
import { IsOrganiser } from '../middleware/IsOrganiser';
import { RoleAuth } from '../middleware/RoleAuth';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

@JsonController('/admin')
@UseBefore(AdminAuthorisation)
export class AdminController {
  constructor(
    private AdminService: AdminService,
    private SponsorService: SponsorService,
    private EventService: EventService,
    private UserService: UserService,
    private CSVService: CSVService,
  ) { }

  @Post('/customQuestion/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async addCustomQuestion(@SelectedEventAlias() event: EventDocument, @Body() body: AddCustomQuestionRequest) {
    const newQuestion = await this.EventService.createQuestion(body.question);
    await this.EventService.addQuestionToEvent(event, newQuestion, body.type);

    return SuccessResponse.Positive;
  }

  @Put('/customQuestion/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async updateCustomQuestion(@SelectedEventAlias() event: EventDocument, @Body() body: UpdateCustomQuestionRequest) {
    await this.EventService.updateQuestion(body.question);

    return SuccessResponse.Positive;
  }

  @Delete('/customQuestion/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async deleteCustomQuestion(@SelectedEventAlias() event: EventDocument, @Body() body: DeleteCustomQuestionRequest) {
    await this.EventService.removeQuestionFromEvent(event, body.question, body.type);
    await this.EventService.deleteQuestion(body.question);

    return SuccessResponse.Positive;
  }

  @Post('/bulkChange')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async bulkChangeUsers(@Body() body: BulkChangeRequest) {
    await this.UserService.changeUserStatuses(body.users, body.status);

    return SuccessResponse.Positive;
  }

  @Post('/addSponsor/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async addSponsorToEvent(@SelectedEventAlias() event: EventDocument, @Body() body: AddNewSponsorRequest) {
    const sponsor = await this.AdminService.getAdminById(body.sponsorId);
    await this.EventService.addSponsorToEvent(event, sponsor);

    return SuccessResponse.Positive;
  }

  @Post('/addOrganiser/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async addOrganiserToEvent(@SelectedEventAlias() event: EventDocument, @Body() body: AddNewOrganiserRequest) {
    const admin = await this.AdminService.getAdminById(body.organiserId);
    await this.EventService.addOrganiserToEvent(event, admin);

    return SuccessResponse.Positive;
  }
}
