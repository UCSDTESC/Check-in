import { EventStatistics } from '@Shared/Types';
import { PageAlert } from '~/pages/AlertPage';

export interface EventStatisticsState {
  [EventName: string]: EventStatistics;
}

export interface EventAlertsState {
  [EventName: string]: PageAlert[];
}
