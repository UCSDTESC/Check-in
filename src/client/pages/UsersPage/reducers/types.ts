import { Column } from '@Shared/Types';

export interface ColumnsState {
  readonly loadedAvailable: boolean;
  readonly available: Column[];
  readonly active: Column[];
}
