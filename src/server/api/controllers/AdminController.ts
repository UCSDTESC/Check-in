import { EventDocument } from '@Models/Event';
import { CSVService } from '@Services/CSVService';
import EventService from '@Services/EventService';
import SponsorService from '@Services/SponsorService';
import UserService from '@Services/UserService';
import { Role, hasRankEqual, hasRankAtLeast } from '@Shared/Roles';
import { Admin } from '@Shared/Types';
import { AddCustomQuestionRequest, UpdateCustomQuestionRequest,
    DeleteCustomQuestionRequest,
    BulkChangeRequest, 
    UpdateEventOptionsRequest} from '@Shared/api/Requests';
import { GetSponsorsResponse, EventsWithStatisticsResponse, SuccessResponse } from '@Shared/api/Responses';
import { Response } from 'express';
import * as moment from 'moment';
import { Get, JsonController, UseBefore, Res, Post, Body, Put, Delete } from 'routing-controllers';

import { AuthorisedAdmin } from '../decorators/AuthorisedAdmin';
import { SelectedEvent } from '../decorators/SelectedEvent';
import { AdminAuthorisation } from '../middleware/AdminAuthorisation';
import { IsOrganiser } from '../middleware/IsOrganiser';
import { RoleAuth } from '../middleware/RoleAuth';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

@JsonController('/admin')
@UseBefore(AdminAuthorisation)
export class AdminController {
  constructor(
    private SponsorService: SponsorService,
    private EventService: EventService,
    private UserService: UserService,
    private CSVService: CSVService,
  ) {}

  @Get('/sponsors')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async getSponsors(): Promise<GetSponsorsResponse> {
    const sponsors = await this.SponsorService.getAllSponsors();
    return sponsors.map(sponsor => ({
      _id: sponsor._id,
      username: sponsor.username,
    })) as GetSponsorsResponse;
  }

  @Get('/events')
  @UseBefore(RoleAuth(Role.ROLE_SPONSOR))
  async getEvents(@AuthorisedAdmin() admin: Admin): Promise<EventsWithStatisticsResponse> {
    let events: EventDocument[];
    if (hasRankEqual(admin, Role.ROLE_SPONSOR)) {
      events = await this.EventService.getEventsBySponsor(admin);
    } else if (hasRankAtLeast(admin, Role.ROLE_DEVELOPER)) {
      events = await this.EventService.getAllPopulatedEvents();
    } else {
      events = await this.EventService.getEventsByOrganiser(admin);
    }

    const eventIDs = events.map(event => event._id.toHexString());
    let userCounts = await this.EventService.getAllUserCounts();
    // Filter UserCounts by events
    userCounts = userCounts.filter(count => eventIDs.includes(count._id));

    return {
      events,
      userCounts,
    };
  }

  @Get('/columns')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async getColumnDisplayNames() {
    const displayNames = this.UserService.getAllDisplayNameFields();
    return displayNames;
  }

  @Get('/export/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(ValidateEventAlias)
  async exportUsersByEvent(@SelectedEvent() event: EventDocument, @Res() response: Response) {
    const eventUsers = await this.UserService.getAllUsersByEvent(event);
    const flattenedUsers = eventUsers.map(user => user.csvFlatten());

    const fileName = `${event.alias}-${moment().format()}.csv`;
    const csv = this.CSVService.parseJSONToCSV(flattenedUsers);
    response = this.CSVService.setJSONReturnHeaders(response, fileName);
    return response.send(csv);
  }

  @Post('/customQuestion/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async addCustomQuestion(@SelectedEvent() event: EventDocument, @Body() body: AddCustomQuestionRequest) {
    const newQuestion = await this.EventService.createQuestion(body.question);
    await this.EventService.addQuestionToEvent(event, newQuestion, body.type);

    return SuccessResponse.Positive;
  }

  @Put('/customQuestion/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async updateCustomQuestion(@SelectedEvent() event: EventDocument, @Body() body: UpdateCustomQuestionRequest) {
    await this.EventService.updateQuestion(body.question);

    return SuccessResponse.Positive;
  }

  @Delete('/customQuestion/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async deleteCustomQuestion(@SelectedEvent() event: EventDocument, @Body() body: DeleteCustomQuestionRequest) {
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

  @Post('/update/:eventAlias')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async updateEventOptions(@SelectedEvent() event: EventDocument, @Body() body: UpdateEventOptionsRequest) {
    await this.EventService.updateEventOptions(event, body.options);

    return SuccessResponse.Positive;
  }
}
