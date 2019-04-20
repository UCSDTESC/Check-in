import { TESCEvent } from 'Shared/types';

export interface EventsState {
  [EventName: string]: TESCEvent;
}

export interface UserEventsState {
  [EventName: string]: TESCEvent;
}
