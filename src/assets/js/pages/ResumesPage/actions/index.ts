import * as Types from './types';
import { createStandardAction } from 'typesafe-actions';
import { TESCUser } from '~/static/types';

// Resumes
export const replaceApplicants = createStandardAction(Types.REPLACE_APPLICANTS)<TESCUser[]>();

export const replaceFiltered = createStandardAction(Types.REPLACE_FILTERED)<number>();
