import { PageAlert } from '~/pages/AlertPage';
import { EventStatistics } from '~/static/types';

export interface EventStatisticsState {
  [EventName: string]: EventStatistics;
}

export interface EventAlertsState {
  [EventName: string]: PageAlert[];
}
