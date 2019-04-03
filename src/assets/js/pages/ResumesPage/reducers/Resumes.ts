import {Reducer} from 'redux';
import * as ActionTypes from '../actions/types';
import { ResumesState } from './types';

const initialState: ResumesState = {
  filtered: 0,
  applicants: [],
};

const resumes: Reducer<ResumesState> = (state: ResumesState = initialState, action) => {
  switch (action.type) {
  case ActionTypes.REPLACE_APPLICANTS:
    return {...state, applicants: [
      ...action.applicants,
    ]};
  case ActionTypes.REPLACE_FILTERED:
    return {...state, filtered: action.filtered};
  default:
    return state;
  }
};

export default resumes;
