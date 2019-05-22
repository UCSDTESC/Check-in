import { EventDocument } from '@Models/Event';
import EventService from '@Services/EventService';
import { TESCEvent } from '@Shared/ModelTypes';
import { EventsWithStatisticsResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Param, QueryParam } from 'routing-controllers';

import { ErrorMessage } from '../../../utils/Errors';
import { SelectedEventAlias } from '../../decorators/SelectedEventAlias';
import { ValidateEventAlias } from '../../middleware/ValidateEventAlias';

@JsonController('/events')
export class EventsController {
  constructor(
    private EventService: EventService
  ) { }

  @Get('/')
  async get(@SelectedEventAlias() selected: EventDocument): Promise<EventsWithStatisticsResponse> {
    const allUserCounts = await this.EventService.getAllUserCounts();
    let returnedUserCounts: typeof allUserCounts = [];

    let publicEvents: EventDocument[] = [];
    if (selected) {
      // Get the ID of the event to filter (if one was specified)
      const event = await this.EventService.getPublicPopulatedEvents(selected.id) as EventDocument;
      publicEvents.push(event);
    } else {
      const allEvents = await this.EventService.getPublicPopulatedEvents() as EventDocument[];
      publicEvents = allEvents;
    }

    // Filter all relevant user counts
    returnedUserCounts = allUserCounts.filter(count =>
      publicEvents.some(event => event._id.toString() === count._id.toString())
    );

    return {
      events: publicEvents,
      userCounts: returnedUserCounts,
    };
  }
}
