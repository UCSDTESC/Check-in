import { TESCEvent } from '~/static/types';

export interface EventsState {
  [EventName: string]: TESCEvent;
}

export interface UserEventsState {
  [EventName: string]: TESCEvent;
}
