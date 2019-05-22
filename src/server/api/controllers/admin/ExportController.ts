import UserService from '@Services/UserService';
import { Role } from '@Shared/Roles';
import { Get, JsonController, UseBefore, Body, Post, Res, BadRequestError } from 'routing-controllers';

import { RoleAuth } from '../../middleware/RoleAuth';
import { ExportUsersRequest } from '@Shared/api/Requests';
import { Response } from 'express-serve-static-core';
import moment = require('moment');
import EventService from '@Services/EventService';
import { ErrorMessage } from 'utils/Errors';
import CSVService from '@Services/CSVService';

@JsonController('/export')
export class ColumnsController {
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
    const flattenedUsers = eventUsers.map(user => user.csvFlatten());

    const fileName = `${event.alias}-${moment().format()}.csv`;
    const csv = this.CSVService.parseJSONToCSV(flattenedUsers);
    response = this.CSVService.setJSONReturnHeaders(response, fileName);
    return response.send(csv);
  }
}
