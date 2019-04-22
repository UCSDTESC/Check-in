import { EventDocument } from '@Models/Event';
import EventService from '@Services/EventService';
import SponsorService from '@Services/SponsorService';
import { Role, hasRankEqual, hasRankAtLeast } from '@Shared/Roles';
import { Admin } from '@Shared/Types';
import { GetSponsorsResponse, EventsWithStatisticsResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore } from 'routing-controllers';

import { AuthorisedAdmin } from '../decorators/AuthorisedAdmin';
import { RoleAuth } from '../middleware/RoleAuth';

@JsonController('/admin')
export class AdminController {
  constructor(
    private SponsorService: SponsorService,
    private EventService: EventService,
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
      events = await this.EventService.getPopulatedEvents();
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
}
