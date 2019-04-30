import { TESCUser } from '@Shared/ModelTypes';

export interface ResumesState {
  readonly filtered: number;
  readonly applicants: TESCUser[];
}
