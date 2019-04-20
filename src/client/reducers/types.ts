import { TESCEvent } from '@Shared/Types';

export interface EventsState {
  [EventName: string]: TESCEvent;
}

export interface UserEventsState {
  [EventName: string]: TESCEvent;
}
