import { TESCEvent } from '@Shared/ModelTypes';
import { EventStatistics } from '@Shared/api/Responses';
import React from 'react';

interface EventStatisticsComponentProps {
  event: TESCEvent;
  statistics: EventStatistics | null;
}

/**
 * This is an abstraction that is used by statistics components to provide an event and statistics prop to them.
 */
export default class EventStatisticsComponent<P = {}, S = {}> extends
  React.Component<P & EventStatisticsComponentProps, S> {

}
