import { handleActions } from 'redux-actions';
import { ActionType } from 'typesafe-actions';

import { _updateEventStatistics } from '../actions';
import * as Types from '../actions/types';

import { EventStatisticsState } from './types';

const initialState: EventStatisticsState = {};

export default handleActions({
  [Types.UPDATE_EVENT_STATISTICS]: (state, action: ActionType<typeof _updateEventStatistics>) => ({
    ...state,
    [action.payload.eventAlias]: action.payload.statistics,
  }),
}, initialState);
