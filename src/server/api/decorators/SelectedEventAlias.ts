import EventService from '@Services/EventService';
import { createParamDecorator } from 'routing-controllers';
import { Container } from 'typedi';

export function SelectedEventAlias(options?: {}) {
  return createParamDecorator({
    required: true,
    value: async action => {
      const eventService = Container.get(EventService);
      const alias = action.request.query.alias;
      return await eventService.getEventByAlias(alias);
    },
  });
}
