import EventService from '@Services/EventService';
import { TESCEvent } from '@Shared/ModelTypes';
import { EventsWithStatisticsResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Param, QueryParam } from 'routing-controllers';

import { ValidateEventAlias } from '../../middleware/ValidateEventAlias';
import { RoleAuth } from '../../middleware/RoleAuth';
import { Role } from '@Shared/Roles';

@JsonController('/events')
export class EventsController {
  constructor(
    private EventService: EventService
  ) { }
}
