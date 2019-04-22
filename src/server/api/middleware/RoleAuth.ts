import { Role, getRoleRank, hasRankAtLeast } from '@Shared/Roles';
import express = require('express');
import { UnauthorizedError } from 'routing-controllers';

import { AdminAuthorisation } from './AdminAuthorisation';

export const RoleAuth = (role: Role) =>
  (req: express.Request, res: express.Response, next?: express.NextFunction) => {
    return (new AdminAuthorisation()).use(req, res, (err: Error) => {
      // Force authentication errors forward
      if (err) {
        return next(err);
      }

      if (!hasRankAtLeast(req.user, role)) {
        return next(new UnauthorizedError());
      }

      next();
    });
  };
