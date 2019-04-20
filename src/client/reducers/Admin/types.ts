import { TESCEvent, Filter } from '@Shared/Types';

export interface EventsState {
  [EventAlias: string]: TESCEvent;
}

export interface FiltersState {
  [FilterName: string]: Filter;
}

export interface GeneralState {
  readonly editing: boolean;
}
