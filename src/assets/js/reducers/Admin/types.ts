import { TESCEvent, Filter } from '~/static/types';

export interface EventsState {
  [EventAlias: string]: TESCEvent;
}

export interface FiltersState {
  [FilterName: string]: Filter;
}

export interface GeneralState {
  readonly editing: boolean;
}
