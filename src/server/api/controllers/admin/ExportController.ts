import CSVService from '@Services/CSVService';
import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { Role } from '@Shared/Roles';
import { ExportUsersRequest } from '@Shared/api/Requests';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { Response } from 'express-serve-static-core';
import moment = require('moment');
import { Get, JsonController, UseBefore, Body, Post, Res, BadRequestError } from 'routing-controllers';
import { ErrorMessage } from 'utils/Errors';

import { RoleAuth } from '../../middleware/RoleAuth';

/**
 * Handles all of the logic for exporting user information.
 */
@JsonController('/export')
@UseBefore(AdminAuthorisation)
export class ExportController {
  constructor(
    private UserService: UserService,
    private EventService: EventService,
    private CSVService: CSVService
  ) { }

  @Post('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async exportUsersByEvent(@Body() body: ExportUsersRequest, @Res() response: Response) {
    const event = await this.EventService.getEventByAlias(body.alias);
    if (!event) {
      throw new BadRequestError(ErrorMessage.NO_ALIAS_EXISTS(body.alias));
    }

    const eventUsers = await this.UserService.getAllUsersByEvent(event);

    var flattenedUsers = eventUsers.map(user => user.csvFlatten(false, body.emailsOnly));

    const fileName = `${event.alias}-${moment().format()}.csv`;
    const csv = this.CSVService.parseJSONToCSV(flattenedUsers);
    response = this.CSVService.setJSONReturnHeaders(response, fileName);
    return response.send(csv);
  }
}