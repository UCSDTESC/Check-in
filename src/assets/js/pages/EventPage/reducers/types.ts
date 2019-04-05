import { EventStatistics } from '~/static/types';

export interface EventStatisticsState {
  [EventName: string]: EventStatistics;
}

export interface EventAlert {
  message: string;
  severity: string;
  title: string;
  timestamp: Date;
}

export interface EventAlertsState {
  [EventName: string]: EventAlert[];
}
