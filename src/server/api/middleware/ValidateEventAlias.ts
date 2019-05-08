import EventService from '@Services/EventService';
import * as express from 'express';
import { ExpressMiddlewareInterface, InternalServerError } from 'routing-controllers';
import { Container } from 'typedi';
import { isNullOrUndefined } from 'util';

import { ErrorMessage } from '../../utils/Errors';

export class ValidateEventAlias implements ExpressMiddlewareInterface {
  async use(req: express.Request, res: express.Response, next?: express.NextFunction) {
    const eventService = Container.get(EventService);
    if (!req.params || !req.params.eventAlias) {
      return next(new InternalServerError(ErrorMessage.NO_EVENT_ALIAS()));
    }

    const alias = req.params.eventAlias;
    const event = await eventService.getEventByAlias(alias);
    if(isNullOrUndefined(event)) {
      return next(new Error(ErrorMessage.NO_ALIAS_EXISTS(alias)));
    }
    next();
  }
}
