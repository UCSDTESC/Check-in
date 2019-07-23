import { TESCEvent } from '@Shared/ModelTypes';
import { Filter, ColumnDefinitions } from '~/static/Types';

export type AvailableColumnsState = ColumnDefinitions;

export interface EventsState {
  [EventAlias: string]: TESCEvent;
}

export interface FiltersState {
  [FilterName: string]: Filter;
}

export interface GeneralState {
  readonly editing: boolean;
}
