import { TESCEvent } from '@Shared/ModelTypes';
import { Filter } from '~/static/Types';

export interface EventsState {
  [EventAlias: string]: TESCEvent;
}

export interface FiltersState {
  [FilterName: string]: Filter;
}

export interface GeneralState {
  readonly editing: boolean;
}
