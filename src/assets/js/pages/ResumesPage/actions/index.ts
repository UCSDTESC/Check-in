import { createStandardAction } from 'typesafe-actions';
import { TESCUser } from '~/static/types';

import * as Types from './types';

// Resumes
export const replaceApplicants = createStandardAction(Types.REPLACE_APPLICANTS)<TESCUser[]>();

export const replaceFiltered = createStandardAction(Types.REPLACE_FILTERED)<number>();
