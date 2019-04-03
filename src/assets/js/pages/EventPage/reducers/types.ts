import { EventStatistics } from "~/static/types";

export interface EventStatisticsState {
  [EventName: string]: EventStatistics
};

export interface EventAlertsState {
  [EventName: string]: {
    message: string,
    severity: string,
    title: string,
    timestamp: Date
  }
};
