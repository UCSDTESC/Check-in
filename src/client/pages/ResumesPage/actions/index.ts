import { TESCUser } from 'Shared/types';
import { createStandardAction } from 'typesafe-actions';

import * as Types from './types';

// Resumes
export const replaceApplicants = createStandardAction(Types.REPLACE_APPLICANTS)<TESCUser[]>();

export const replaceFiltered = createStandardAction(Types.REPLACE_FILTERED)<number>();
