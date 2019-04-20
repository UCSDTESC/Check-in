import { EventStatistics } from 'Shared/types';
import { PageAlert } from '~/pages/AlertPage';

export interface EventStatisticsState {
  [EventName: string]: EventStatistics;
}

export interface EventAlertsState {
  [EventName: string]: PageAlert[];
}
