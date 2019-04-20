import EventService from '@Services/EventService';
import { createParamDecorator } from 'routing-controllers';
import { Container } from 'typedi';

export function SelectedEvent(options?: {}) {
  return createParamDecorator({
    required: true,
    value: action => {
      const eventService = Container.get(EventService);
      return eventService.getEventByAlias(action.request.params.eventAlias);
    },
  });
}
