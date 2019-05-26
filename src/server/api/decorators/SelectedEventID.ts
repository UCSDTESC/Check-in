import EventService from '@Services/EventService';
import { createParamDecorator } from 'routing-controllers';
import { Container } from 'typedi';

export function SelectedEventID(options?: {}) {
  return createParamDecorator({
    required: true,
    value: async action => {
      const eventService = Container.get(EventService);
      const eventId = action.request.params.eventId;
      return await eventService.getEventById(eventId);
    },
  });
}
