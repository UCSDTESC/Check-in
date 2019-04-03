import { Column } from '~/static/types';

export interface ColumnsState {
  loadedAvailable: boolean;
  available: Column[];
  active: Column[];
}
