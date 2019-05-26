import { EventDocument } from '@Models/Event';
import StatisticsService from '@Services/StatisticsService';
import { EventStatistics } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore } from 'routing-controllers';

import { SelectedEventAlias } from '../../decorators/SelectedEventAlias';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { IsOrganiser } from '../../middleware/IsOrganiser';
import { ValidateEventAlias } from '../../middleware/ValidateEventAlias';
import EventService from '@Services/EventService';
import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { Admin } from '@Shared/ModelTypes';
import { RoleAuth } from '../../middleware/RoleAuth';
import { Role } from '@Shared/Roles';

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
