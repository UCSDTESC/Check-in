import { TESCUser } from '~/static/types';

export interface ResumesState {
  readonly filtered: number;
  readonly applicants: TESCUser[];
}
