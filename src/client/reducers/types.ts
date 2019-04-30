import { TESCEvent } from '@Shared/ModelTypes';

export interface EventsState {
  [EventName: string]: TESCEvent;
}

export interface UserEventsState {
  [EventName: string]: TESCEvent;
}
