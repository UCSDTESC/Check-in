import EventService from '@Services/EventService';
import * as express from 'express';
import { ExpressMiddlewareInterface, InternalServerError, BadRequestError } from 'routing-controllers';
import { Container } from 'typedi';
import { isNullOrUndefined } from 'util';

import { ErrorMessage } from '../../utils/Errors';

export class ValidateEventID implements ExpressMiddlewareInterface {
  async use(req: express.Request, res: express.Response, next?: express.NextFunction) {
    const eventService = Container.get(EventService);
    if (!req.params || !req.params.eventId) {
      return next(new BadRequestError(ErrorMessage.NO_EVENT_ALIAS()));
    }

    const eventId = req.params.eventId;
    const event = await eventService.getEventById(eventId);
    if (isNullOrUndefined(event)) {
      return next(new Error(ErrorMessage.NO_ID_EXISTS(eventId)));
    }
    next();
  }
}
