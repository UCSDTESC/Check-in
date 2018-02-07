import * as Types from './types';

// Resumes
export const replaceApplicants = (applicants) => ({
  type: Types.REPLACE_APPLICANTS,
  applicants
});

export const replaceFiltered = (filtered) => ({
  type: Types.REPLACE_FILTERED,
  filtered
});
