import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { EventStatisticsState } from './types';

const initialState: EventStatisticsState = {};

const eventStatistics: Reducer<EventStatisticsState> =
(state: EventStatisticsState = initialState, action) => {
  switch (action.type) {
  case ActionTypes.UPDATE_EVENT_STATISTICS: {
    return {...state, [action.event]: action.statistics};
  }
  default:
    return state;
  }
};

export default eventStatistics;
