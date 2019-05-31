import { TESCUser } from '@Shared/ModelTypes';
import { FiltersState } from '~/reducers/Admin/types';
import { Filter } from '~/static/Types';

/**
 * Applies the user defined filters to resumes.
 * @param {FilterState} The list of filters.
 * @param {TESCUser[]} The list of applicants.
 * @return {TESCUser[]} The array of filtered applicants.
 */
export function applyResumeFilter(filters: FiltersState, applicants: TESCUser[]) {
  const filterNames = Object.keys(filters);

  if (filterNames.length === 0) {
    return applicants;
  }

  return applicants.filter(applicant => (
    Object.values(filters)
      .every((filter: Filter, filterIndex) => {
        const filterName = filterNames[filterIndex];
        const optionNames = Object.keys(filter.options);

        // Only use enabled filters
        if (!filter.enabled || Object.keys(filter.options).length === 0) {
          return true;
        }

        return Object.values(filter.options)
          .some((option, optionIndex) => {
            // Ignore the filter if it's disabled or doesn't exist on the user
            if (!option || !applicant.hasOwnProperty(filterName)) {
              return false;
            }

            // @ts-ignore: Trying to access possibly undefined property
            return applicant[filterName].toLowerCase() ===
              optionNames[optionIndex].toLowerCase();
          });
      })
  ));
}
