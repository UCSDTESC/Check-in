import EventService from '@Services/EventService';
import { Role } from '@Shared/Roles';
import { TESCEvent } from '@Shared/Types';
import { EventsWithStatisticsResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore } from 'routing-controllers';

import { RoleAuth } from '../middleware/RoleAuth';

@JsonController('/events')
export class EventsController {
  constructor(
    private EventService: EventService
  ) {}

  @Get('/')
  async getAll(): Promise<EventsWithStatisticsResponse> {
    const publicEvents = await this.EventService.getAllPublicEvents();
    const userCounts = await this.EventService.getAllUserCounts();

    return {
      events: publicEvents,
      userCounts,
    };
  }
}
