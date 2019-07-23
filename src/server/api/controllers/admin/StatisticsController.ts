import { EventDocument } from '@Models/Event';
import EventService from '@Services/EventService';
import StatisticsService from '@Services/StatisticsService';
import { Admin } from '@Shared/ModelTypes';
import { Role } from '@Shared/Roles';
import { EventStatistics } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore } from 'routing-controllers';

import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { SelectedEventAlias } from '../../decorators/SelectedEventAlias';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { RoleAuth } from '../../middleware/RoleAuth';

/**
 * Handles all of the logic for fetching event registration information.
 */
@JsonController('/statistics')
@UseBefore(AdminAuthorisation)
export class StatisticsController {
  constructor(
    private EventService: EventService,
    private StatisticsService: StatisticsService
  ) { }

  @Get('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async get(@AuthorisedAdmin() admin: Admin, @SelectedEventAlias() event: EventDocument): Promise<EventStatistics> {
    await this.EventService.isAdminOrganiser(event.alias, admin);
    return this.StatisticsService.getEventStatistics(event);
  }
}
