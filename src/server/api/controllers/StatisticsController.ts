import { EventDocument } from '@Models/event';
import { StatisticsService } from '@Services/StatisticsService';
import { EventStatistics } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore } from 'routing-controllers';

import { SelectedEvent } from '../decorators/SelectedEvent';
import { IsOrganiser } from '../middleware/IsOrganiser';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

@JsonController('/statistics')
export class StatisticsController {
  constructor(
    private StatisticsService: StatisticsService
  ) {}

  @Get('/:eventAlias')
  @UseBefore(IsOrganiser)
  @UseBefore(ValidateEventAlias)
  async get(@SelectedEvent() event: EventDocument): Promise<EventStatistics> {
    return this.StatisticsService.getEventStatistics(event);
  }
}
