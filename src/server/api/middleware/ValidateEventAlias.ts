import EventService from '@Services/EventService';
import * as express from 'express';
import { ExpressMiddlewareInterface, InternalServerError, BadRequestError } from 'routing-controllers';
import { Container } from 'typedi';
import { isNullOrUndefined } from 'util';

import { ErrorMessage } from '../../utils/Errors';

export class ValidateEventAlias implements ExpressMiddlewareInterface {
  async use(req: express.Request, res: express.Response, next?: express.NextFunction) {
    const eventService = Container.get(EventService);
    if (!req.query || !req.query.alias) {
      return next(new BadRequestError(ErrorMessage.NO_EVENT_ALIAS()));
    }

    const alias = req.query.alias;
    const event = await eventService.getEventByAlias(alias);
    if (isNullOrUndefined(event)) {
      return next(new Error(ErrorMessage.NO_ALIAS_EXISTS(alias)));
    }
    next();
  }
}
