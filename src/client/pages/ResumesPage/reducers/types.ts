import { TESCUser } from '@Shared/Types';

export interface ResumesState {
  readonly filtered: number;
  readonly applicants: TESCUser[];
}
