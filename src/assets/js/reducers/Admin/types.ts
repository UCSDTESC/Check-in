import { TESCEvent, Filter } from '~/static/types';

export interface EventsState {
  [EventName: string]: TESCEvent;
}

export interface FiltersState {
  [FilterName: string]: Filter;
}

export interface GeneralState {
  editing: boolean;
}
