import EventService from '@Services/EventService';
import { TESCEvent } from '@Shared/Types';
import { EventsWithStatisticsResponse } from '@Shared/api/Responses';
import { SelectedEvent } from 'api/decorators/SelectedEvent';
import { ValidateEventAlias } from 'api/middleware/ValidateEventAlias';
import { Get, JsonController, UseBefore, Param } from 'routing-controllers';

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

  @Get('/:eventAlias')
  @UseBefore(ValidateEventAlias)
  async getOne(@Param('eventAlias') alias: string): Promise<TESCEvent> {
    return this.EventService.getPublicPopulatedEventByAlias(alias);
  }
}
