import { Column } from 'Shared/types';

export interface ColumnsState {
  readonly loadedAvailable: boolean;
  readonly available: Column[];
  readonly active: Column[];
}
