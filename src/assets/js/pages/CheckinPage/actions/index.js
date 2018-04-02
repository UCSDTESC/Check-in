import {showLoading, hideLoading} from 'react-redux-loading-bar';

import * as Types from './types';

import * as Api from '~/data/Api';

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

export const userCheckin = (user, eventAlias) => (dispatch) =>
  Api.checkinUser(user._id, eventAlias)
    .then(() => {
      dispatch({
        type: Types.CHECKIN_USER,
        user
      });
    })
    .catch(console.error);
