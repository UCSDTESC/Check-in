import { Column } from '~/static/types';

export interface ColumnsState {
  readonly loadedAvailable: boolean;
  readonly available: Column[];
  readonly active: Column[];
}
