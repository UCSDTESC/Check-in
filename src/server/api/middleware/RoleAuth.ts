import { Role, hasRankAtLeast } from '@Shared/Roles';
import express = require('express');
import { UnauthorizedError, BadRequestError } from 'routing-controllers';

import { ErrorMessage } from '../../utils/Errors';

export const RoleAuth = (role: Role) =>
  (req: express.Request, res: express.Response, next?: express.NextFunction) => {
    if (!req.user) {
      return next(new BadRequestError(ErrorMessage.NO_REQUEST_USER()));
    }

    if (!hasRankAtLeast(req.user, role)) {
      return next(new UnauthorizedError());
    }

    next();
  };
