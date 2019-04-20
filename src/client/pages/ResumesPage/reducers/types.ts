import { TESCUser } from 'Shared/types';

export interface ResumesState {
  readonly filtered: number;
  readonly applicants: TESCUser[];
}
