import EventService from '@Services/EventService';
import { TESCEvent, Admin } from '@Shared/ModelTypes';
import { EventsWithStatisticsResponse, SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Param, QueryParam, Post, UploadedFile, BodyParam, Put, Body, BadRequestError } from 'routing-controllers';

import { ValidateEventAlias } from '../../middleware/ValidateEventAlias';
import { RoleAuth } from '../../middleware/RoleAuth';
import { Role, hasRankEqual, hasRankAtLeast } from '@Shared/Roles';
import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { EventDocument } from '@Models/Event';
import Uploads from '@Config/Uploads';
import { RegisterEventRequest, UpdateEventOptionsRequest } from '@Shared/api/Requests';
import { AdminDocument } from '@Models/Admin';
import { ErrorMessage } from 'utils/Errors';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';

@JsonController('/events')
@UseBefore(AdminAuthorisation)
export class EventsController {
  constructor(
    private EventService: EventService
  ) { }

  @Get('/')
  @UseBefore(RoleAuth(Role.ROLE_SPONSOR))
  async getEvents(@AuthorisedAdmin() admin: Admin) {
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

  @Post('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async createNewEvent(@UploadedFile('logo', { options: Uploads }) logo: Express.Multer.File,
    @BodyParam('event') event: RegisterEventRequest, @AuthorisedAdmin() admin: AdminDocument) {
    let newEvent = await this.EventService.createNewEvent(event, logo.path);

    if (hasRankEqual(admin, Role.ROLE_ADMIN)) {
      newEvent = await this.EventService.addOrganiserToEvent(newEvent, admin);
    }
    return newEvent;
  }

  @Put('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async updateEventOptions(@Body() body: UpdateEventOptionsRequest) {
    const event = await this.EventService.getEventByAlias(body.alias);
    if (!event) {
      throw new BadRequestError(ErrorMessage.NO_ALIAS_EXISTS(body.alias));
    }

    await this.EventService.updateEventOptions(event, body.options);

    return SuccessResponse.Positive;
  }
}
