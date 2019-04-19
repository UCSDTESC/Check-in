import React from 'react';
import { TESCEvent, EventStatistics } from '~/static/types';

interface EventStatisticsComponentProps {
  event: TESCEvent;
  statistics: EventStatistics | null;
}

export default class EventStatisticsComponent<P = {}, S = {}> extends
  React.Component<P & EventStatisticsComponentProps, S> {

}
