import * as Types from '~/actions/types';

//const INITIAL_STATE = {};
const INITIAL_STATE = {
  'university': {
    displayName: 'University',
    enabled: false,
    editable: true,
    options: {
      'The University of California, San Diego': true
    }
  },
  'major': {
    displayName: 'Major',
    enabled: false,
    editable: true,
    options: {
      'Computer Engineering': false,
      'Computer Science': false,
    }
  },
  'year': {
    displayName: 'Year',
    enabled: false,
    editable: false,
    options: {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5+': false,
      'Graduate': false
    }
  },
  'gender': {
    displayName: 'Gender',
    enabled: false,
    editable: false,
    options: {
      'Male': false,
      'Female': false,
      'Non-Binary': false,
      'Transgender' : false,
      'I prefer not to say': false,
      'Other': false
    }
  },
};

/**
 * Adds a new filter to the system.
 * @param {Object} state The existing redux state.
 * @param {Object} action The action parameters.
 */
function addFilter(state, action) {
  // Already exists
  if (state[action.name]) {
    return state;
  }

  return {...state, [action.name]: {
    displayName: action.displayName,
    enabled: true,
    options: {}
  }};
}

/**
 * Removes an existing filter from the system.
 * @param {Object} state The existing redux state.
 * @param {Object} action The action parameters.
 */
function removeFilter(state, action) {
  // Filter out all filters that aren't that filter
  return Object.keys(state)
    .filter(key => key !== action.name)
    .reduce((result, current) => {
      result[current] = state[current];
      return result;
    }, {});
}


/**
 * Enables or disables a given filter.
 * @param {Object} filter The existing filter.
 */
function toggleFilter(filter) {
  return filter.enabled ? disableFilter(filter) : enableFilter(filter);
}

/**
 * Enables a given filter.
 * @param {Obect} filter The exsiting filter.
 */
function enableFilter(filter) {
  return {...filter, enabled: true};
}

/**
 * Disables a given filter.
 * @param {Object} filter The existing filter.
 */
function disableFilter(filter) {
  return {...filter, enabled: false};
}

/**
 * Adds a filter option to the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function addFilterOption(options, action) {
  if (options[action.option]) {
    return filter;
  }

  return {...options, [action.option]: true};
}

/**
 *Removes a filter option from the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function removeFilterOption(options, action) {
  return Object.keys(filter.options)
    .filter(key => key !== action.option)
    .reduce((result, current) => {
      result[current] = state[current];
      return result;
    }, {});
}

/**
 * Enables an option on the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function enableFilterOption(options, action) {
  return {...options, [action.option]: true};
}

/**
 * Disables an option on the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function disableFilterOption(options, action) {
  return {...options, [action.option]: false};
}

/**
 * Toggles the option on the filter.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function toggleFilterOption(options, action) {
  return options[action.option] ? disableFilterOption(options, action) :
    enableFilterOption(options, action);
}

/**
 * Enables all filter options.
 * @param {Object} options The existing options for the selected filter.
 */
function selectAllFilterOptions(options) {
  return Object.keys(options).reduce((result, key) => {
    result[key] = true;
    return result;
  }, {});
}

/**
 * Disables all filter options.
 * @param {Object} options The existing options for the selected filter.
 */
function selectNoneFilterOptions(options) {
  return Object.keys(options).reduce((result, key) => {
    result[key] = false;
    return result;
  }, {});
}

/**
 * Passes an existing filter option on to modifying reducer actions.
 * @param {Object} options The existing options for the selected filter.
 * @param {Object} action The action parameters.
 */
function selectFilterOption(options, action) {
  switch (action.type) {
  case Types.ENABLE_FILTER_OPTION:
    return enableFilterOption(options, action);
  case Types.DISABLE_FILTER_OPTION:
    return disableFilterOption(options, action);
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
function option(options, action) {
  switch (action.type) {
  case Types.ADD_FILTER_OPTION:
    return addFilterOption(options, action);
  case Types.REMOVE_FILTER_OPTION:
    return removeFilterOption(options, action);
  case Types.ENABLE_FILTER_OPTION:
  case Types.DISABLE_FILTER_OPTION:
  case Types.TOGGLE_FILTER_OPTION:
    return selectFilterOption(options, action);
  case Types.SELECT_ALL_FILTER_OPTIONS:
    return selectAllFilterOptions(options);
  case Types.SELECT_NONE_FILTER_OPTIONS:
    return selectNoneFilterOptions(options);
  }

  return options;
};

/**
 * Passes an existing filter onto modifying reducer actions.
 * @param {Object} state The existing redux state.
 * @param {Object} action The action parameters.
 */
function selectFilter(state, action) {
  if (!state[action.name]) {
    return state;
  }

  let filter = state[action.name];

  switch (action.type) {
  case Types.ENABLE_FILTER:
    return {...state, [action.name]: enableFilter(filter)};
  case Types.DISABLE_FILTER:
    return {...state, [action.name]: disableFilter(filter)};
  case Types.TOGGLE_FILTER:
    return {...state, [action.name]: toggleFilter(filter)};

  case Types.ADD_FILTER_OPTION:
  case Types.REMOVE_FILTER_OPTION:
  case Types.ENABLE_FILTER_OPTION:
  case Types.DISABLE_FILTER_OPTION:
  case Types.TOGGLE_FILTER_OPTION:
  case Types.SELECT_ALL_FILTER_OPTIONS:
  case Types.SELECT_NONE_FILTER_OPTIONS:
    return {...state, [action.name]: {
      ...filter,
      options: option(filter.options, action)
    }};
  }

  return {...state, [action.name]: filter};
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
  case Types.ADD_FILTER:
    return addFilter(state, action);
  case Types.REMOVE_FILTER:
    return removeFilter(state, action);
  case Types.ENABLE_FILTER:
  case Types.DISABLE_FILTER:
  case Types.TOGGLE_FILTER:
  case Types.ADD_FILTER_OPTION:
  case Types.REMOVE_FILTER_OPTION:
  case Types.ENABLE_FILTER_OPTION:
  case Types.DISABLE_FILTER_OPTION:
  case Types.TOGGLE_FILTER_OPTION:
  case Types.SELECT_ALL_FILTER_OPTIONS:
  case Types.SELECT_NONE_FILTER_OPTIONS:
    return selectFilter(state, action);
  }

  return state;
};
