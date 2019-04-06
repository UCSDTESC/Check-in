import * as Types from '../actions/types';
import { ResumesState } from './types';
import { handleActions, ReducerMap } from 'redux-actions';
import { ActionType } from 'typesafe-actions';
import { replaceApplicants, replaceFiltered } from '../actions';

const initialState: ResumesState = {
  filtered: 0,
  applicants: [],
};

export default handleActions({
  [Types.REPLACE_APPLICANTS]: (state, action: ActionType<typeof replaceApplicants>) => ({
    ...state,
    applicants: [
      ...action.payload,
    ],
  }),
  [Types.REPLACE_FILTERED]: (state, action: ActionType<typeof replaceFiltered>) => ({
    ...state,
    filtered: action.payload,
  }),
} as ReducerMap<ResumesState, any>, initialState);
