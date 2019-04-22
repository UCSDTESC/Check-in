import EventService from '@Services/EventService';
import { EventsWithStatisticsResponse } from '@Shared/api/Responses';
import { Get, JsonController } from 'routing-controllers';

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
