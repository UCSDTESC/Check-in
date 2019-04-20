import { TESCEvent, EventStatistics } from 'Shared/types';
import React from 'react';

interface EventStatisticsComponentProps {
  event: TESCEvent;
  statistics: EventStatistics | null;
}

export default class EventStatisticsComponent<P = {}, S = {}> extends
  React.Component<P & EventStatisticsComponentProps, S> {

}
