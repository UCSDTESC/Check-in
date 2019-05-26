import { EventDocument } from '@Models/Event';
import EventService from '@Services/EventService';
import { TESCEvent } from '@Shared/ModelTypes';
import { EventsWithStatisticsResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Param, QueryParam } from 'routing-controllers';

import { ErrorMessage } from '../../../utils/Errors';
import { SelectedEventAlias } from '../../decorators/SelectedEventAlias';
import { ValidateEventAlias } from '../../middleware/ValidateEventAlias';

/**
 * Handles all of the logic for user event registrations.
 */
@JsonController('/user')
export class UserController {
  constructor(
    private EventService: EventService
  ) { }
}
