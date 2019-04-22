import EventService from '@Services/EventService';
import * as express from 'express';
import { InternalServerError, ExpressMiddlewareInterface } from 'routing-controllers';
import { Container } from 'typedi';

import { ErrorMessage } from '../../utils/Errors';

export class IsOrganiser implements ExpressMiddlewareInterface {
  async use(req: express.Request, res: express.Response, next?: express.NextFunction) {
    if (!req.user) {
      return next(new InternalServerError(ErrorMessage.NO_REQUEST_USER()));
    }

    const eventService = Container.get(EventService);
    const alias = req.params.eventAlias;
    eventService.isAdminOrganiser(alias, req.user)
    .then((isOrganiser) => {
      if (!isOrganiser) {
        return next(new Error(ErrorMessage.NOT_ORGANISER()));
      }

      next();
    });
  }
}
