import { EventStatistics } from '~/static/types';

export interface EventStatisticsState {
  [EventName: string]: EventStatistics;
}

export interface EventAlert {
  readonly message: string;
  readonly severity: string;
  readonly title: string;
  readonly timestamp: Date;
}

export interface EventAlertsState {
  [EventName: string]: EventAlert[];
}
