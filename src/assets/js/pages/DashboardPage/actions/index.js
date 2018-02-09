import {showLoading, hideLoading} from 'react-redux-loading-bar';

import * as Types from './types';

import * as Api from '~/data/Api';

// Events
export const addEvents = (events) => ({
  type: Types.ADD_EVENTS,
  events
});

export const replaceEvents = (events) => ({
  type: Types.REPLACE_EVENTS,
  events
});

// Stats
export const changeUserStats = (newStats) => ({
  type: Types.CHANGE_USER_STATS,
  newStats
});

export const changeUniversityStats = (newStats) => ({
  type: Types.CHANGE_UNIVERSITY_STATS,
  newStats
});

export const loadAllStats = () => {
  return function (dispatch) {
    dispatch(showLoading());

    Api.loadUserStats()
    .then((res) => {
      dispatch(changeUserStats(res));
      dispatch(hideLoading());
    });

    Api.loadUniversityStats()
    .then((res) => {
      dispatch(changeUniversityStats(res));
    });
  };
};
