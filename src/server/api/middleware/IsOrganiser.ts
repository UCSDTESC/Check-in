import EventService from '@Services/EventService';
import * as express from 'express';
import { InternalServerError } from 'routing-controllers';
import { Container } from 'typedi';

import { ErrorMessage } from '../../utils/Errors';

import { AdminAuthorisation } from './AdminAuthorisation';

export class IsOrganiser extends AdminAuthorisation {
  async use(req: express.Request, res: express.Response, next?: express.NextFunction) {
    return super.use(req, res, (err: Error) => {
      const eventService = Container.get(EventService);
      if (!req.user) {
        return next(new InternalServerError(ErrorMessage.NO_REQUEST_USER()));
      }

      const alias = req.params.eventAlias;
      eventService.isAdminOrganiser(alias, req.user)
      .then((isOrganiser) => {
        if (!isOrganiser) {
          return next(new Error(ErrorMessage.NOT_ORGANISER()));
        }

        next();
      });
    });
  }
}
