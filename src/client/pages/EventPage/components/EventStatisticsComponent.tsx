import { TESCEvent } from '@Shared/ModelTypes';
import { EventStatistics } from '@Shared/api/Responses';
import React from 'react';

interface EventStatisticsComponentProps {
  event: TESCEvent;
  statistics: EventStatistics | null;
}

export default class EventStatisticsComponent<P = {}, S = {}> extends
  React.Component<P & EventStatisticsComponentProps, S> {

}
