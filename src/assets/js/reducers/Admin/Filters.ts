import {handleActions} from 'redux-actions';
import * as Types from '~/actions/types';
import * as Actions from '~/actions';
import { FiltersState } from './types';
import { FilterOptions, Filter, FilterOption } from '~/static/types';
import { ActionType } from 'typesafe-actions';

const INITIAL_STATE: FiltersState = {
  university: {
    displayName: 'University',
    enabled: false,
    editable: true,
    options: {
      'The University of California, San Diego': true,
    },
  },
  major: {
    displayName: 'Major',
    enabled: false,
    editable: true,
    options: {
      'Computer Engineering': false,
      'Computer Science': false,
    },
  },
  year: {
    displayName: 'Year',
    enabled: false,
    editable: false,
    options: {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5+': false,
      'Graduate': false,
    },
  },
  gender: {
    displayName: 'Gender',
    enabled: false,
    editable: false,
    options: {
      'Male': false,
      'Female': false,
      'Non-Binary': false,
      'Transgender' : false,
      'I prefer not to say': false,
      'Other': false,
    },
  },
};

/**
 * Adds a new filter to the system.
 */
function addFilter(state: FiltersState, action: ActionType<typeof Actions.addFilter>) {
  // Already exists
  if (state[action.payload.name]) {
    return state;
  }

  return {...state,
    [action.payload.name]: {
      displayName: action.payload.displayName,
      enabled: true,
      options: {},
      editable: true,
    },
  };
}

/**
 * Removes an existing filter from the system.
 * @param {Object} state The existing redux state.
 * @param {Object} action The action parameters.
 */
function removeFilter(state: FiltersState, action: ActionType<typeof Actions.removeFilter>) {
  // Filter out all filters that aren't that filter
  return Object.keys(state)
    .filter(key => key !== action.payload)
    .reduce((result: FiltersState, current) => {
      result[current] = state[current];
      return result;
    }, {});
}

/**
 * Enables or disables a given filter.
 * @param {Object} filter The existing filter.
 */
function toggleFilter(filter: Filter): Filter {
  return filter.enabled ? disableFilter(filter) : enableFilter(filter);
}

/**
 * Enables a given filter.
 * @param {Obect} filter The exsiting filter.
 */
function enableFilter(filter: Filter): Filter {
  return {...filter, enabled: true};
}

/**
 * Disables a given filter.
 * @param {Object} filter The existing filter.
 */
function disableFilter(filter: Filter): Filter {
  return {...filter, enabled: false};
}

/**
 * Adds a filter option to the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function addFilterOption(options: FilterOptions,
                         action: ActionType<typeof Actions.filterOptionActions.addFilterOption>) {
  if (options[action.payload.optionValue]) {
    return {...options};
  }

  return {...options, [action.payload.optionValue]: true};
}

/**
 * Removes a filter option from the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function removeFilterOption(options: FilterOptions,
                            action: ActionType<typeof Actions.filterOptionActions.removeFilterOption>) {
  return Object.keys(options)
    .filter(key => key !== action.payload.optionValue)
    .reduce((result: FilterOptions, current) => {
      result[current] = options[current];
      return result;
    }, {});
}

/**
 * Enables an option on the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function enableFilterOption(options: FilterOptions, toEnable: FilterOption) {
  return {...options, [toEnable.optionValue]: true};
}

/**
 * Disables an option on the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function disableFilterOption(options: FilterOptions, toDisable: FilterOption) {
  return {...options, [toDisable.optionValue]: false};
}

/**
 * Toggles the option on the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function toggleFilterOption(options: FilterOptions,
                            action: ActionType<typeof Actions.filterOptionActions.toggleFilterOption>) {
  return options[action.payload.optionValue] ? disableFilterOption(options, action.payload) :
    enableFilterOption(options, action.payload);
}

/**
 * Enables all filter options.
 * @param {Object} options The existing options for the selected filter.
 */
function selectAllFilterOptions(options: FilterOptions) {
  return Object.keys(options).reduce((result: FilterOptions, key) => {
    result[key] = true;
    return result;
  }, {});
}

/**
 * Disables all filter options.
 * @param {Object} options The existing options for the selected filter.
 */
function selectNoneFilterOptions(options: FilterOptions) {
  return Object.keys(options).reduce((result: FilterOptions, key) => {
    result[key] = false;
    return result;
  }, {});
}

/**
 * Passes an existing filter option on to modifying reducer actions.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function selectFilterOption(options: FilterOptions, action: Actions.FilterOptionActionsTypes) {
  switch (action.type) {
  case Types.ENABLE_FILTER_OPTION:
    return enableFilterOption(options, action.payload);
  case Types.DISABLE_FILTER_OPTION:
    return disableFilterOption(options, action.payload);
  case Types.TOGGLE_FILTER_OPTION:
    return toggleFilterOption(options, action);
  }
  return options;
}

/**
 * Passes an existing filter option onto modifying reducer actions.
 * @param {Object} options The existing options for a filter.
 * @param {Object} action The action parameters.
 */
function option(options: FilterOptions, action: Actions.FilterOptionActionsTypes) {
  switch (action.type) {
  case Types.ADD_FILTER_OPTION:
    return addFilterOption(options, action);
  case Types.REMOVE_FILTER_OPTION:
    return removeFilterOption(options, action);
  case Types.ENABLE_FILTER_OPTION:
  case Types.DISABLE_FILTER_OPTION:
  case Types.TOGGLE_FILTER_OPTION:
    return selectFilterOption(options, action);
  }

  return options;
}

/**
 * Passes an existing filter onto modifying reducer actions.
 * @param {Object} state The existing redux state.
 * @param {Object} action The action parameters.
 */
function selectFilter(state: FiltersState, action: Actions.FilterActionsTypes) {
  if (!state[action.payload]) {
    return state;
  }

  const filter = state[action.payload];

  switch (action.type) {
  case Types.ENABLE_FILTER:
    return {...state, [action.payload]: enableFilter(filter)};
  case Types.DISABLE_FILTER:
    return {...state, [action.payload]: disableFilter(filter)};
  case Types.TOGGLE_FILTER:
    return {...state, [action.payload]: toggleFilter(filter)};
  }

  return state;
}

/**
 * Passes an existing filter onto modifying reducer actions.
 * @param {Object} state The existing redux state.
 * @param {Object} action The action parameters.
 */
function selectFilterOptions(state: FiltersState, action: Actions.FilterOptionActionsTypes) {
  if (!state[action.payload.filterName]) {
    return state;
  }

  const filter = state[action.payload.filterName];

  switch (action.type) {
  case Types.ADD_FILTER_OPTION:
  case Types.REMOVE_FILTER_OPTION:
  case Types.ENABLE_FILTER_OPTION:
  case Types.DISABLE_FILTER_OPTION:
  case Types.TOGGLE_FILTER_OPTION:
    return {...state, [action.payload.filterName]: {
      ...filter,
      options: option(filter.options, action),
    }};
  }

  return state;
}

const handleSelectFilterOptions = (state: FiltersState, action: Actions.FilterOptionActionsTypes) =>
  selectFilterOptions(state, action);

const handleSelectFilter = (state: FiltersState, action: Actions.FilterActionsTypes) =>
  selectFilter(state, action);

export default handleActions({
  [Types.ADD_FILTER]: (state: FiltersState, action: ActionType<typeof Actions.addFilter>) =>
    addFilter(state, action),
  [Types.REMOVE_FILTER]: (state: FiltersState, action: ActionType<typeof Actions.removeFilter>) =>
    removeFilter(state, action),
  [Types.ENABLE_FILTER]: handleSelectFilter,
  [Types.DISABLE_FILTER]: handleSelectFilter,
  [Types.TOGGLE_FILTER]: handleSelectFilter,
  [Types.ADD_FILTER_OPTION]: handleSelectFilterOptions,
  [Types.REMOVE_FILTER_OPTION]: handleSelectFilterOptions,
  [Types.ENABLE_FILTER_OPTION]: handleSelectFilterOptions,
  [Types.DISABLE_FILTER_OPTION]: handleSelectFilterOptions,
  [Types.TOGGLE_FILTER_OPTION]: handleSelectFilterOptions,
  [Types.SELECT_ALL_FILTER_OPTIONS]: (state: FiltersState, action: ActionType<typeof Actions.selectAllOptions>) => {
    if (!state[action.payload]) {
      return state;
    }

    const filter = state[action.payload];

    return {...state, [action.payload]: {
      ...filter,
      options: selectAllFilterOptions(filter.options),
    }};
  },
  [Types.SELECT_NONE_FILTER_OPTIONS]: (state: FiltersState, action: ActionType<typeof Actions.selectNoneOptions>) => {
    if (!state[action.payload]) {
      return state;
    }

    const filter = state[action.payload];

    return {...state, [action.payload]: {
      ...filter,
      options: selectNoneFilterOptions(filter.options),
    }};
  },
}, INITIAL_STATE);
