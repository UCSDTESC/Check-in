import { EventDocument } from '@Models/Event';
import { CSVService } from '@Services/CSVService';
import EventService from '@Services/EventService';
import SponsorService from '@Services/SponsorService';
import UserService from '@Services/UserService';
import { Role, hasRankEqual, hasRankAtLeast } from '@Shared/Roles';
import { Admin, TESCEvent } from '@Shared/Types';
import { GetSponsorsResponse, EventsWithStatisticsResponse } from '@Shared/api/Responses';
import { SelectedEvent } from 'api/decorators/SelectedEvent';
import { ValidateEventAlias } from 'api/middleware/ValidateEventAlias';
import { Response } from 'express';
import * as moment from 'moment';
import { Get, JsonController, UseBefore, Res } from 'routing-controllers';

import { AuthorisedAdmin } from '../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../middleware/AdminAuthorisation';
import { RoleAuth } from '../middleware/RoleAuth';

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
}
